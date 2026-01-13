import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from './models/Task.js';
import Employee from './models/Employee.js';
import connectDB from './config/db.js';

dotenv.config();

const seedOverdue = async () => {
    try {
        await connectDB();

        // Find an employee to assign to
        const employee = await Employee.findOne({ role: 'employee' });
        if (!employee) {
            console.log("No employee found to assign task to.");
            process.exit();
        }

        console.log(`Assigning overdue task to ${employee.firstName}...`);

        await Task.create({
            title: "Test Overdue Task",
            description: "This task is created to test the Reassign button.",
            date: new Date().toISOString(), // Created now
            deadline: new Date(Date.now() - 86400000), // Deadline yesterday
            category: "Frontend Developer", // Ensure this matches user's designation or just generic
            assignedTo: employee._id,
            roleRequired: employee.designation,
            status: 'overdue' // Force status overdue
        });

        console.log("✓ Created 'Test Overdue Task'");
        console.log("Please refreshing the Admin Dashboard.");
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

seedOverdue();
