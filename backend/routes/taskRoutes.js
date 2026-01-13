import express from 'express';
import { createTask, getTasks, getTaskById, updateTaskStatus, reassignTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.patch('/:id/status', updateTaskStatus);
router.put('/:id/reassign', reassignTask);
router.delete('/:id', deleteTask);

export default router;
