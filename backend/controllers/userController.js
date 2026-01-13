import Employee from '../models/Employee.js';
import Task from '../models/Task.js';
import Designation from '../models/Designation.js';

// @desc    Get all employees
// @route   GET /api/users
export const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({ role: 'employee' });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single employee by ID
// @route   GET /api/users/:id
export const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete employee by ID
// @route   DELETE /api/users/:id
export const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Delete all tasks assigned to this employee
        const deletedTasks = await Task.deleteMany({ assignedTo: req.params.id });

        // Delete the employee
        await Employee.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Employee deleted successfully',
            tasksDeleted: deletedTasks.deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get all unique designations
// @route   GET /api/users/designations
export const getUniqueDesignations = async (req, res) => {
    try {
        const count = await Designation.countDocuments();
        if (count === 0) {
            const defaultRoles = [
                "Frontend Developer",
                "Backend Developer",
                "UI/UX Designer",
                "QA Engineer",
                "DevOps Engineer",
                "Product Manager",
                "HR Executive"
            ];
            await Designation.insertMany(defaultRoles.map(title => ({ title })));
        }
        const designations = await Designation.find({}).sort({ title: 1 });
        res.json(designations.map(d => d.title));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
