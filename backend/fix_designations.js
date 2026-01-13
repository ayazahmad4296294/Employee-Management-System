import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/Employee.js'; // Adjust path if needed
import connectDB from './config/db.js';

dotenv.config();

const fixDesignations = async () => {
    try {
        await connectDB();

        console.log("Connected to DB. Checking Employees...");

        const employees = await Employee.find({});
        console.log(`Found ${employees.length} employees.`);

        let updatedCount = 0;
        for (const emp of employees) {
            console.log(`- ${emp.firstName}: ${emp.designation || 'MISSING'}`);
            if (!emp.designation) {
                emp.designation = "Software Engineer"; // Default backfill
                await emp.save();
                updatedCount++;
                console.log(`  -> Updated to 'Software Engineer'`);
            }
        }

        console.log(`\nFixed ${updatedCount} employees.`);
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

fixDesignations();
