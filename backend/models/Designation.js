import mongoose from 'mongoose';

const designationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const Designation = mongoose.model('Designation', designationSchema);
export default Designation;
