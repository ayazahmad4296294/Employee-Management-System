import Admin from '../models/Admin.js';
import Employee from '../models/Employee.js';
import Task from '../models/Task.js';

// @desc    Auth user (Admin or Employee)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    try {
        // 1. Try to find in Admin collection
        let user = await Admin.findOne({ email: normalizedEmail });
        let role = 'admin';

        // 2. If not found, try Employee collection
        if (!user) {
            user = await Employee.findOne({ email: normalizedEmail });
            role = 'employee';
        }

        if (user && user.password === password) {
            let tasks = [];
            if (role === 'employee') {
                tasks = await Task.find({ assignedTo: user._id }).lean();
            }

            res.json({
                _id: user._id,
                firstName: user.firstName,
                email: user.email,
                role: role,
                designation: user.designation || null,
                taskCounters: user.taskCounters || null,
                tasks: tasks || []
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new employee
// @route   POST /api/auth/register-employee
// @access  Private (Admin)
export const registerEmployee = async (req, res) => {
    const { firstName, email, password, designation } = req.body;
    const normalizedEmail = email.toLowerCase();

    try {
        const employeeExists = await Employee.findOne({ email: normalizedEmail });
        const adminExists = await Admin.findOne({ email: normalizedEmail });

        if (employeeExists || adminExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const employee = await Employee.create({
            firstName,
            email: normalizedEmail,
            passworod: password, // Note: fixing a typo if it exists, but the original code was 'password'. Wait, did I see a typo? No, line 63 was 'password'. I'll just rewrite it correctly.
            password,
            designation
        });

        res.status(201).json({
            _id: employee._id,
            firstName: employee.firstName,
            email: employee.email,
            role: 'employee',
            designation: employee.designation
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update profile (Name or Password)
// @route   PATCH /api/auth/update-profile
// @access  Private
export const updateProfile = async (req, res) => {
    const { userId, role, firstName, oldPassword, newPassword } = req.body;

    try {
        let user;
        if (role === 'admin') {
            user = await Admin.findById(userId);
        } else {
            user = await Employee.findById(userId);
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update Name if provided
        if (firstName) {
            user.firstName = firstName;
        }

        // Handle Password Change if requested
        if (oldPassword && newPassword) {
            if (user.password !== oldPassword) {
                return res.status(401).json({ message: 'Incorrect current password' });
            }
            user.password = newPassword;
        }

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                firstName: user.firstName,
                email: user.email,
                role: role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
