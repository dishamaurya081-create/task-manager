
const express = require('express');
const router = express.Router();

const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    toggleTaskCompletion,
    deleteTask
} = require('../controllers/taskController');

// GET /tasks - Get all tasks
router.get('/', getAllTasks);

// POST /tasks - Create a task
router.post('/', createTask);

// GET /tasks/:id - Get one task
router.get('/:id', getTaskById);

// PUT /tasks/:id - Update a task
router.put('/:id', updateTask);

// PATCH /tasks/:id/complete - Complete or undo a task
router.patch('/:id/complete', toggleTaskCompletion);

// DELETE /tasks/:id - Delete a task
router.delete('/:id', deleteTask);

module.exports = router;
