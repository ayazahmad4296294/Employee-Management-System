import express from 'express';
import { loginUser, registerEmployee, updateProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register-employee', registerEmployee);
router.patch('/update-profile', updateProfile);

export default router;
