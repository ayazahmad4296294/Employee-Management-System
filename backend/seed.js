import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Task from './models/Task.js';

dotenv.config();
connectDB();

const employees = [
    {
        firstName: "Ali",
        email: "e@e.com",
        password: "1234",
        role: "employee",
        taskCounters: { active: 2, newTask: 5, completed: 2, failed: 1 },
        tasks: [
            { title: "Prepare Sales Report", description: "Create monthly sales report for management", date: "2026-01-05", category: "Reporting", active: true, newTask: true, completed: false, failed: false },
            { title: "Client Follow-up", description: "Follow up with pending clients via email", date: "2026-01-03", category: "Communication", active: false, newTask: false, completed: true, failed: false },
            { title: "Data Cleanup", description: "Clean old entries from the database", date: "2026-01-02", category: "Database", active: false, newTask: false, completed: false, failed: true },
            { title: "Team Meeting", description: "Weekly sync with team members", date: "2026-01-06", category: "Meeting", active: true, newTask: true, completed: false, failed: false }
        ],
    },
    {
        firstName: "Ahmed",
        email: "employee2@example.com",
        password: "1234",
        role: "employee",
        taskCounters: { active: 3, newTask: 1, completed: 1, failed: 0 },
        tasks: [
            { title: "UI Fixes", description: "Fix alignment issues on dashboard", date: "2026-01-06", category: "Frontend", active: true, newTask: true, completed: false, failed: false },
            { title: "Bug Testing", description: "Test reported bugs from QA team", date: "2026-01-04", category: "Testing", active: true, newTask: false, completed: false, failed: false },
            { title: "Deploy Build", description: "Deploy latest build to staging server", date: "2026-01-01", category: "Deployment", active: false, newTask: false, completed: true, failed: false }
        ],
    },
    {
        firstName: "Usman",
        email: "employee3@example.com",
        password: "1234",
        role: "employee",
        taskCounters: { active: 2, newTask: 1, completed: 1, failed: 1 },
        tasks: [
            { title: "Write API Docs", description: "Document authentication APIs", date: "2026-01-07", category: "Documentation", active: true, newTask: true, completed: false, failed: false },
            { title: "Optimize Queries", description: "Improve slow SQL queries", date: "2026-01-03", category: "Backend", active: false, newTask: false, completed: true, failed: false },
            { title: "Server Monitoring", description: "Monitor server performance", date: "2026-01-02", category: "DevOps", active: false, newTask: false, completed: false, failed: true }
        ],
    },
    {
        firstName: "Bilal",
        email: "employee4@example.com",
        password: "1234",
        role: "employee",
        taskCounters: { active: 2, newTask: 1, completed: 1, failed: 1 },
        tasks: [
            { title: "Design Banner", description: "Create banner for marketing campaign", date: "2026-01-06", category: "Design", active: true, newTask: true, completed: false, failed: false },
            { title: "Update Brand Kit", description: "Update company brand assets", date: "2026-01-04", category: "Design", active: false, newTask: false, completed: true, failed: false },
            { title: "Export Assets", description: "Export assets in required formats", date: "2026-01-02", category: "Assets", active: false, newTask: false, completed: false, failed: true }
        ],
    },
    {
        firstName: "Hassan",
        email: "employee5@example.com",
        password: "1234",
        role: "employee",
        taskCounters: { active: 3, newTask: 1, completed: 1, failed: 0 },
        tasks: [
            { title: "Content Writing", description: "Write blog post for website", date: "2026-01-08", category: "Content", active: true, newTask: true, completed: false, failed: false },
            { title: "SEO Optimization", description: "Optimize blog for SEO", date: "2026-01-05", category: "Marketing", active: true, newTask: false, completed: false, failed: false },
            { title: "Publish Post", description: "Publish approved blog post", date: "2026-01-01", category: "Publishing", active: false, newTask: false, completed: true, failed: false }
        ],
    },
];

const admin = [
    {
        firstName: "Admin",
        email: "admin@example.com",
        password: "1234",
        role: "admin",
        taskCounters: { active: 0, newTask: 0, completed: 0, failed: 0 }
    }
];

const seedData = async () => {
    try {
        await User.deleteMany();
        await Task.deleteMany();

        for (const emp of employees) {
            const { tasks, ...userData } = emp;
            const user = await User.create(userData);

            for (const t of tasks) {
                let status = 'new';
                if (t.active) status = 'active';
                if (t.completed) status = 'completed';
                if (t.failed) status = 'failed';

                await Task.create({
                    ...t,
                    status,
                    assignedTo: user._id
                });
            }
        }

        await User.insertMany(admin);

        console.log('Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
