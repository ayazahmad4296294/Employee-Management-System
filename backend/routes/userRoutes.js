import express from 'express';
import { getEmployees, getEmployeeById, deleteEmployee, getUniqueDesignations } from '../controllers/userController.js';

const router = express.Router();

console.log("User Routes loaded");
router.get('/', getEmployees);
router.get('/designations', getUniqueDesignations);
router.get('/:id', getEmployeeById);
router.delete('/:id', deleteEmployee);

export default router;
