import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'active', 'completed', 'failed', 'overdue'],
        default: 'new'
    },
    deadline: {
        type: Date,
        required: true
    },
    roleRequired: {
        type: String,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;
