
// =====================================
// 1. Get HTML elements
// =====================================

const taskForm = document.getElementById('task-form');
const taskFormSection = document.getElementById('task-form-section');

const openTaskFormBtn = document.getElementById('open-task-form');
const closeTaskFormBtn = document.getElementById('close-task-form');
const cancelTaskBtn = document.getElementById('cancel-task');

const taskIdInput = document.getElementById('task-id');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionInput = document.getElementById('task-description');
const taskDueDateInput = document.getElementById('task-due-date');
const taskPriorityInput = document.getElementById('task-priority');

const formHeading = document.getElementById('form-heading');
const saveTaskBtn = document.getElementById('save-task-btn');

const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

const totalCount = document.getElementById('total-count');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');
const overdueCount = document.getElementById('overdue-count');


// =====================================
// 2. Application data
// =====================================

const API_URL = '/tasks';

let tasks = [];
let currentFilter = 'All';


// =====================================
// 3. Helper functions
// =====================================

// Escape special HTML characters before displaying user input.
function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, function (character) {
        const characters = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return characters[character];
    });
}

// Format a date without accidentally changing its calendar day.
function formatDate(dateString) {
    if (!dateString) {
        return 'No due date';
    }

    const date = new Date(dateString + 'T00:00:00');

    if (Number.isNaN(date.getTime())) {
        return 'Invalid date';
    }

    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Check whether a pending task is overdue.
function isOverdue(task) {
    if (!task.due_date || task.status === 'Completed') {
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.due_date + 'T00:00:00');

    return !Number.isNaN(dueDate.getTime()) && dueDate < today;
}

// Display a message to the user.
function showMessage(message, type = 'success') {
    const oldMessage = document.querySelector('.message');

    if (oldMessage) {
        oldMessage.remove();
    }

    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;

    taskList.parentElement.insertBefore(messageElement, taskList);
}


// =====================================
// 4. API communication
// =====================================

// Send requests to the backend.
async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}


// =====================================
// 5. Load tasks from the database
// =====================================

async function loadTasks() {
    taskList.innerHTML = `
        <div class="empty-state">
            <h3>Loading tasks...</h3>
            <p>Please wait a moment.</p>
        </div>
    `;

    try {
        const data = await apiRequest(API_URL);

        tasks = data.tasks || [];

        updateStatistics();
        displayTasks();

    } catch (error) {
        taskList.innerHTML = `
            <div class="empty-state">
                <h3>Unable to load tasks</h3>
                <p>${escapeHTML(error.message)}</p>
            </div>
        `;
    }
}


// =====================================
// 6. Update dashboard statistics
// =====================================

function updateStatistics() {
    const total = tasks.length;

    const pending = tasks.filter(
        task => task.status === 'Pending'
    ).length;

    const completed = tasks.filter(
        task => task.status === 'Completed'
    ).length;

    const overdue = tasks.filter(
        task => isOverdue(task)
    ).length;

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
    overdueCount.textContent = overdue;
}


// =====================================
// 7. Search, filter and sort tasks
// =====================================

function getVisibleTasks() {
    let visibleTasks = [...tasks];

    // Filter by status.
    if (currentFilter !== 'All') {
        visibleTasks = visibleTasks.filter(
            task => task.status === currentFilter
        );
    }

    // Search in title and description.
    const keyword = searchInput.value.trim().toLowerCase();

    if (keyword) {
        visibleTasks = visibleTasks.filter(task => {
            const title = (task.title || '').toLowerCase();
            const description = (task.description || '').toLowerCase();

            return title.includes(keyword) ||
                   description.includes(keyword);
        });
    }

    // Sort tasks.
    const sortValue = sortSelect.value;

    if (sortValue === 'newest') {
        visibleTasks.sort((a, b) => {
            return b.id - a.id;
        });
    }

    if (sortValue === 'dueDate') {
        visibleTasks.sort((a, b) => {
            if (!a.due_date) return 1;
            if (!b.due_date) return -1;

            return a.due_date.localeCompare(b.due_date);
        });
    }

    if (sortValue === 'priority') {
        const priorityOrder = {
            High: 3,
            Medium: 2,
            Low: 1
        };

        visibleTasks.sort((a, b) => {
            return (priorityOrder[b.priority] || 0) -
                   (priorityOrder[a.priority] || 0);
        });
    }

    return visibleTasks;
}


// =====================================
// 8. Display tasks on the dashboard
// =====================================

function displayTasks() {
    const visibleTasks = getVisibleTasks();

    if (visibleTasks.length === 0) {
        let message = 'Create your first task to get started.';

        if (tasks.length > 0) {
            message = 'Try changing your search or filter.';
        }

        taskList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks found</h3>
                <p>${message}</p>
            </div>
        `;

        return;
    }

    taskList.innerHTML = visibleTasks.map(task => {
        const completed = task.status === 'Completed';
        const overdue = isOverdue(task);

        const priorityClass = {
            Low: 'priority-low',
            Medium: 'priority-medium',
            High: 'priority-high'
        }[task.priority] || 'priority-medium';

        const statusClass = completed
            ? 'status-completed'
            : 'status-pending';

        return `
            <article class="task-card ${completed ? 'completed-task' : ''}">

                <div class="task-card-header">
                    <div>
                        <h3 class="task-title">
                            ${escapeHTML(task.title)}
                        </h3>
                    </div>
                </div>

                ${task.description ? `
                    <p class="task-description">
                        ${escapeHTML(task.description)}
                    </p>
                ` : ''}

                <div class="task-meta">

                    <span class="priority-badge ${priorityClass}">
                        ${escapeHTML(task.priority)}
                    </span>

                    <span class="status-badge ${statusClass}">
                        ${escapeHTML(task.status)}
                    </span>

                    <span>
                        Due: ${escapeHTML(formatDate(task.due_date))}
                    </span>

                    ${overdue ? `
                        <span class="overdue-label">Overdue</span>
                    ` : ''}

                </div>

                <div class="task-actions">

                    <button
                        class="complete-btn"
                        data-action="complete"
                        data-id="${task.id}"
                    >
                        ${completed ? 'Undo' : 'Complete'}
                    </button>

                    <button
                        class="edit-btn"
                        data-action="edit"
                        data-id="${task.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        data-action="delete"
                        data-id="${task.id}"
                    >
                        Delete
                    </button>

                </div>

            </article>
        `;
    }).join('');
}


// =====================================
// 9. Open and close the task form
// =====================================

function openForm() {
    taskFormSection.style.display = 'block';

    taskFormSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    taskTitleInput.focus();
}

function closeForm() {
    taskFormSection.style.display = 'none';
    taskForm.reset();

    taskIdInput.value = '';
    formHeading.textContent = 'Create New Task';
    saveTaskBtn.textContent = 'Save Task';
}

openTaskFormBtn.addEventListener('click', () => {
    closeForm();
    openForm();
});

closeTaskFormBtn.addEventListener('click', closeForm);
cancelTaskBtn.addEventListener('click', closeForm);


// =====================================
// 10. Create or update a task
// =====================================

taskForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const title = taskTitleInput.value.trim();

    if (!title) {
        showMessage('Please enter a task title.', 'error');
        taskTitleInput.focus();
        return;
    }

    const taskData = {
        title: title,
        description: taskDescriptionInput.value.trim(),
        due_date: taskDueDateInput.value || null,
        priority: taskPriorityInput.value
    };

    const taskId = taskIdInput.value;

    const isEditing = Boolean(taskId);

    const url = isEditing
        ? `${API_URL}/${taskId}`
        : API_URL;

    const method = isEditing ? 'PUT' : 'POST';

    saveTaskBtn.disabled = true;
    saveTaskBtn.textContent = 'Saving...';

    try {
        await apiRequest(url, {
            method: method,
            body: JSON.stringify(taskData)
        });

        closeForm();

        await loadTasks();

        showMessage(
            isEditing
                ? 'Task updated successfully!'
                : 'Task created successfully!'
        );

    } catch (error) {
        showMessage(error.message, 'error');

    } finally {
        saveTaskBtn.disabled = false;
        saveTaskBtn.textContent = isEditing ? 'Update Task' : 'Save Task';
    }
});


// =====================================
// 11. Edit an existing task
// =====================================

function editTask(id) {
    const task = tasks.find(
        item => item.id === id
    );

    if (!task) {
        showMessage('Task not found.', 'error');
        return;
    }

    taskIdInput.value = task.id;
    taskTitleInput.value = task.title;
    taskDescriptionInput.value = task.description || '';
    taskDueDateInput.value = task.due_date || '';
    taskPriorityInput.value = task.priority || 'Medium';

    formHeading.textContent = 'Edit Task';
    saveTaskBtn.textContent = 'Update Task';

    openForm();
}


// =====================================
// 12. Complete or undo a task
// =====================================

async function toggleTask(id) {
    try {
        const data = await apiRequest(
            `${API_URL}/${id}/complete`,
            {
                method: 'PATCH'
            }
        );

        await loadTasks();

        showMessage(data.message || 'Task status updated!');

    } catch (error) {
        showMessage(error.message, 'error');
    }
}


// =====================================
// 13. Delete a task
// =====================================

async function deleteTask(id) {
    const confirmed = window.confirm(
        'Are you sure you want to delete this task?'
    );

    if (!confirmed) {
        return;
    }

    try {
        await apiRequest(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        await loadTasks();

        showMessage('Task deleted successfully!');

    } catch (error) {
        showMessage(error.message, 'error');
    }
}


// =====================================
// 14. Handle task action buttons
// =====================================

taskList.addEventListener('click', function (event) {
    const button = event.target.closest('button[data-action]');

    if (!button) {
        return;
    }

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === 'complete') {
        toggleTask(id);
    }

    if (action === 'edit') {
        editTask(id);
    }

    if (action === 'delete') {
        deleteTask(id);
    }
});


// =====================================
// 15. Search and filter events
// =====================================

searchInput.addEventListener('input', displayTasks);

sortSelect.addEventListener('change', displayTasks);

document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function () {
        currentFilter = this.dataset.filter;

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        this.classList.add('active');

        displayTasks();
    });
});


// =====================================
// 16. Start the application
// =====================================

loadTasks();
