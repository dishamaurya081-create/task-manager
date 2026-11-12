
const db = require('../database');

// 1. Create a new task
exports.createTask = (req, res) => {
    const { title, description, due_date, priority } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Title is required'
        });
    }

    if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid priority'
        });
    }

    const sql = `
        INSERT INTO tasks (title, description, due_date, priority)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [title.trim(), description || '', due_date || null, priority || 'Medium'],
        function (error) {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create task'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Task created successfully',
                taskId: this.lastID
            });
        }
    );
};

// 2. Get all tasks
exports.getAllTasks = (req, res) => {
    const sql = 'SELECT * FROM tasks ORDER BY created_at DESC';

    db.all(sql, [], (error, rows) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch tasks'
            });
        }

        res.status(200).json({
            success: true,
            count: rows.length,
            tasks: rows
        });
    });
};

// 3. Get one task by ID
exports.getTaskById = (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid task ID'
        });
    }

    db.get('SELECT * FROM tasks WHERE id = ?', [id], (error, task) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch task'
            });
        }

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            task
        });
    });
};

// 4. Update a task
exports.updateTask = (req, res) => {
    const id = Number(req.params.id);
    const { title, description, due_date, priority } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid task ID'
        });
    }

    if (!title || !title.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Title is required'
        });
    }

    if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid priority'
        });
    }

    const sql = `
        UPDATE tasks
        SET title = ?,
            description = ?,
            due_date = ?,
            priority = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(
        sql,
        [title.trim(), description || '', due_date || null, priority || 'Medium', id],
        function (error) {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update task'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Task updated successfully'
            });
        }
    );
};

// 5. Complete or undo a task
exports.toggleTaskCompletion = (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid task ID'
        });
    }

    db.get('SELECT status FROM tasks WHERE id = ?', [id], (error, task) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update task status'
            });
        }

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';

        db.run(
            `UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [newStatus, id],
            function (updateError) {
                if (updateError) {
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to update task status'
                    });
                }

                res.status(200).json({
                    success: true,
                    message: 'Task status updated successfully',
                    status: newStatus
                });
            }
        );
    });
};

// 6. Delete a task
exports.deleteTask = (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid task ID'
        });
    }

    db.run('DELETE FROM tasks WHERE id = ?', [id], function (error) {
        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete task'
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    });
};
