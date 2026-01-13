import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Designation from './models/Designation.js';
import connectDB from './config/db.js';

dotenv.config();

const seedRoles = async () => {
    try {
        await connectDB();
        const roles = [
            "Frontend Developer",
            "Backend Developer",
            "UI/UX Designer",
            "QA Engineer",
            "DevOps Engineer"
        ];

        console.log("Checking roles...");
        for (const title of roles) {
            const exists = await Designation.findOne({ title });
            if (!exists) {
                await Designation.create({ title });
                console.log(`+ Added: ${title}`);
            } else {
                console.log(`✓ Exists: ${title}`);
            }
        }
        console.log("Done.");
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

seedRoles();
