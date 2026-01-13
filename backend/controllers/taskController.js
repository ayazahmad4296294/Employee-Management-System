import Task from '../models/Task.js';
import Employee from '../models/Employee.js';
import mongoose from 'mongoose';

// @desc    Create a new task
// @route   POST /api/tasks
export const createTask = async (req, res) => {
    const { title, description, date, category, assignedTo } = req.body;

    try {
        // assignedTo should now be the Employee _id
        const employee = await Employee.findById(assignedTo);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Parse date string to Date object for deadline (assuming YYYY-MM-DD or similar)
        const deadlineDate = new Date(date);

        // Ensure deadline is end of that day to avoid premature timeout? 
        // User just said "deadline". Let's assume the date provided is the deadline.
        // We'll set it to the end of that day (23:59:59) to be fair, or just use as is.
        // Let's keep it simple: new Date(date).

        const task = new Task({
            title,
            description,
            date,
            deadline: deadlineDate,
            category,
            assignedTo: employee._id,
            roleRequired: employee.designation // Lock task to this role
        });

        const createdTask = await task.save();

        // Update employee counters
        employee.taskCounters.newTask += 1;
        await employee.save();

        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check for overdue tasks and reassign
// @route   Internal / Background
// @desc    Check for overdue tasks and reassign
// @route   Internal / Background
export const checkOverdueAndReassign = async () => {
    try {
        const now = new Date();
        const gracePeriod = new Date(now - 5 * 60 * 1000); // 5 Minutes Buffer for Auto-Reassign

        // PHASE 1: MARK OVERDUE
        // Find tasks that are 'new'/'active' and deadline passed. 
        // Mark them as 'overdue' immediately so Admin sees them.
        const tasksToMarkOverdue = await Task.find({
            status: { $in: ['new', 'active'] },
            deadline: { $lt: now },
            updatedAt: { $lt: gracePeriod } // Grace Period: Don't mark as overdue if assigned < 5 mins ago
        });

        if (tasksToMarkOverdue.length > 0) {
            console.log(`Marking ${tasksToMarkOverdue.length} tasks as overdue.`);
            for (const task of tasksToMarkOverdue) {
                // Update employee counters (failed count incr, active/new decr)
                const employee = await Employee.findById(task.assignedTo);
                if (employee) {
                    if (task.status === 'new') employee.taskCounters.newTask = Math.max(0, employee.taskCounters.newTask - 1);
                    if (task.status === 'active') employee.taskCounters.active = Math.max(0, employee.taskCounters.active - 1);
                    employee.taskCounters.failed += 1;
                    await employee.save();
                }

                task.status = 'overdue';
                await task.save();
            }
        }

        // PHASE 2: AUTO-REASSIGN
        // Find tasks that are 'overdue' AND deadline passed by > 5 mins (Grace Period).
        // This gives Admin 5 mins to manually reassign.
        const tasksToReassign = await Task.find({
            status: 'overdue',
            deadline: { $lt: gracePeriod },
            updatedAt: { $lt: gracePeriod } // Extra safety: don't reassign if just updated
        });

        if (tasksToReassign.length === 0) return;

        console.log(`Found ${tasksToReassign.length} overdue tasks ready for auto-reassignment.`);

        for (const task of tasksToReassign) {
            const oldAssigneeId = task.assignedTo;
            const role = task.roleRequired;

            // Find candidates with same designation, excluding current assignee
            const candidates = await Employee.find({
                designation: role,
                _id: { $ne: oldAssigneeId }
            });

            if (candidates.length > 0) {
                const newAssignee = candidates[Math.floor(Math.random() * candidates.length)];

                // Old employee counters already updated in Phase 1 (when marked overdue)
                // But if they weren't (e.g. system crashed), we rely on current 'overdue' status.
                // 'overdue' maps to 'failed' bucket. We don't double count.

                // Update Task to New Assignee
                task.assignedTo = newAssignee._id;
                task.status = 'new';
                // Set deadline to now + X? No, user said "deadline remains same".
                // But we must update 'updatedAt' (automatic) to reset the grace period timer if it were to fail again.
                // Actually, if status is 'new', Phase 2 won't pick it up. Phase 1 won't picking it up (deadline past) UNLESS we change deadline.
                // Critical: If deadline is PAST, Phase 1 will immediately mark it 'overdue' again on next run!
                // Solution: We MUST extend deadline OR ignore 'new' tasks with past deadline in Phase 1?
                // Logic Phase 1: `status: { $in: ['new', 'active'] }, deadline: { $lt: now }`
                // If we set to 'new' and deadline is yesterday, Phase 1 marks it 'overdue' in 1 min.
                // Then Phase 2 waits 5 mins and reassigns again. Constant loop every 6 mins.
                // User Requirement: "The deadline remains the same."
                // This implies an infinite loop of failure is possible.
                // However, "new" implies the employee hasn't seen it / started it.
                // Maybe we should allow 'new' tasks to exist with past deadline?
                // Or maybe Phase 1 should 'updatedAt' check too?
                // Let's add 'updatedAt' check to Phase 1 so we give the new guy some time (e.g. 5 mins) before marking overdue again.

                await task.save();

                // Update NEW employee counters
                newAssignee.taskCounters.newTask += 1;
                await newAssignee.save();

                console.log(`Task "${task.title}" auto-reassigned to ${newAssignee.firstName}`);
            } else {
                console.log(`No candidates for ${task.title}. Leaving as overdue.`);
            }
        }
    } catch (error) {
        console.error("Error in auto-reassignment:", error);
    }
};

// @desc    Unified Get Tasks
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
    try {
        const { role, userid } = req.headers;
        let query = {};

        if (role === 'employee') {
            if (!mongoose.Types.ObjectId.isValid(userid)) {
                return res.status(400).json({ message: 'Invalid User ID' });
            }
            query = { assignedTo: new mongoose.Types.ObjectId(userid) };
        }

        const tasks = await Task.find(query).populate('assignedTo', 'firstName');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Single Task Detail
// @route   GET /api/tasks/:id
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'firstName');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task status (Accept/Done/Fail)
// @route   PATCH /api/tasks/:id/status
export const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const employee = await Employee.findById(task.assignedTo);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update employee task counters based on status change
        const oldStatus = task.status;

        // Decrement old status counter
        if (oldStatus === 'new') employee.taskCounters.newTask -= 1;
        else if (oldStatus === 'active') employee.taskCounters.active -= 1;
        else if (oldStatus === 'completed') employee.taskCounters.completed -= 1;
        else if (oldStatus === 'failed') employee.taskCounters.failed -= 1;
        // Don't decrement for 'overdue' if we aren't tracking it explicitly, or map it to failed

        // Increment new status counter
        if (status === 'new') employee.taskCounters.newTask += 1;
        else if (status === 'active') employee.taskCounters.active += 1;
        else if (status === 'completed') employee.taskCounters.completed += 1;
        else if (status === 'failed') employee.taskCounters.failed += 1;

        // Update task status
        task.status = status;
        await task.save();
        await employee.save();

        res.json({
            message: 'Task status updated successfully',
            task,
            taskCounters: employee.taskCounters
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Manually reassign a task
// @route   PUT /api/tasks/:id/reassign
export const reassignTask = async (req, res) => {
    try {
        const { assignedTo: newAssigneeId } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const oldAssigneeId = task.assignedTo;
        const oldEmployee = await Employee.findById(oldAssigneeId);
        const newEmployee = await Employee.findById(newAssigneeId);

        if (!newEmployee) {
            return res.status(404).json({ message: 'New employee not found' });
        }

        // Check if role matches (optional but good for consistency)
        if (task.roleRequired && newEmployee.designation !== task.roleRequired) {
            // We can warn or allow. User requirement: "reassign... to another employee with the same designation".
            // Let's enforce it or at least check.
            // "Admin should be able to manually reassign... to another employee with the same designation."
            // Enforcing strictness might be annoying if roles change, but per req, let's enforce IF roleRequired is set.
            if (newEmployee.designation !== task.roleRequired) {
                return res.status(400).json({ message: `Employee must be a ${task.roleRequired}` });
            }
        }

        // Update counters
        if (oldEmployee) {
            // Decrement whatever status the task was in
            if (task.status === 'new') oldEmployee.taskCounters.newTask = Math.max(0, oldEmployee.taskCounters.newTask - 1);
            else if (task.status === 'active') oldEmployee.taskCounters.active = Math.max(0, oldEmployee.taskCounters.active - 1);
            else if (task.status === 'completed') oldEmployee.taskCounters.completed = Math.max(0, oldEmployee.taskCounters.completed - 1);
            else if (task.status === 'failed') oldEmployee.taskCounters.failed = Math.max(0, oldEmployee.taskCounters.failed - 1);
            else if (task.status === 'overdue') oldEmployee.taskCounters.failed = Math.max(0, oldEmployee.taskCounters.failed - 1); // Treat overdue as failed logically for counter decrement? Or just ignore if we don't track 'overdue' in counters.
            // Note: Employee model key `failed` exists. `overdue` status is new. Use `failed` bucket for overdue/failed tasks probably.

            await oldEmployee.save();
        }

        // Increment new employee "newTask" or "active"? 
        // If it's overdue, they need to know. Let's put it in 'newTask' so they see it.
        newEmployee.taskCounters.newTask += 1;
        await newEmployee.save();

        // Update Task
        task.assignedTo = newAssigneeId;
        task.status = 'new'; // Always reset to new

        await task.save();

        res.json({
            message: 'Task reassigned successfully',
            task
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const employee = await Employee.findById(task.assignedTo);
        if (employee) {
            // Decrement counters
            const status = task.status;
            if (status === 'new') employee.taskCounters.newTask = Math.max(0, employee.taskCounters.newTask - 1);
            else if (status === 'active') employee.taskCounters.active = Math.max(0, employee.taskCounters.active - 1);
            else if (status === 'completed') employee.taskCounters.completed = Math.max(0, employee.taskCounters.completed - 1);
            else if (status === 'failed') employee.taskCounters.failed = Math.max(0, employee.taskCounters.failed - 1);
            else if (status === 'overdue') employee.taskCounters.failed = Math.max(0, employee.taskCounters.failed - 1);

            await employee.save();
        }

        await Task.findByIdAndDelete(req.params.id);

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
