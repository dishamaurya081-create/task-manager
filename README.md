# TaskFlow — Full-Stack Task Management Application

TaskFlow is a responsive task management web application built with **HTML, CSS, JavaScript, Node.js, Express.js, and SQLite**. It helps users organize their daily work, track deadlines, manage priorities, and monitor task progress through a simple dashboard.

## Features

### Task Management
- Create new tasks with a title, description, due date, and priority.
- View all saved tasks.
- Edit existing tasks.
- Mark tasks as completed or undo completion.
- Delete tasks with confirmation.
- Persistent storage using SQLite.

### Dashboard
- View total, pending, completed, and overdue task counts.
- Search tasks by title or description.
- Filter tasks by All, Pending, and Completed.
- Sort tasks by creation order, due date, and priority.
- Highlight overdue tasks.

### User Interface
- Clean and responsive dashboard.
- Sidebar navigation.
- Task priority and status indicators.
- Responsive layout for smaller screens.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and responsive design |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | REST API |
| SQLite | Database |
| Postman / API testing tool | API testing |

## Project Structure

```text
task-manager/
│
├── backend/
│   ├── controllers/
│   │   └── taskController.js
│   ├── routes/
│   │   └── tasks.js
│   ├── database.js
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── database/
│   └── tasks.db
│
├── tests/
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js and npm installed.
- Git installed (for version control).

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project directory

```bash
cd task-manager
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the application

```bash
node backend/server.js
```

### 5. Open the application

Visit:

```text
http://localhost:3000
```

The SQLite database and tasks table are initialized automatically when the backend starts. The database file is stored in the `database` directory.

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Retrieve all tasks |
| POST | `/tasks` | Create a task |
| GET | `/tasks/:id` | Retrieve a task by ID |
| PUT | `/tasks/:id` | Update a task |
| PATCH | `/tasks/:id/complete` | Toggle task completion |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/api/health` | Check server status |

### Example: Create a Task

**POST** `/tasks`

Request body:

```json
{
  "title": "Complete assignment",
  "description": "Finish the full-stack development assignment",
  "due_date": "2026-11-20",
  "priority": "High"
}
```

## Database

TaskFlow uses SQLite to store task information.

Each task contains:

- `id` — Unique task identifier.
- `title` — Task title.
- `description` — Task details.
- `due_date` — Task deadline.
- `priority` — Low, Medium, or High.
- `status` — Pending or Completed.
- `created_at` — Task creation timestamp.
- `updated_at` — Last update timestamp.

SQL queries use parameterized values for database operations.

## Testing

The application was manually tested for:

- Task creation and retrieval.
- Task editing and deletion.
- Completing and undoing tasks.
- Invalid title and priority validation.
- Invalid and non-existent task IDs.
- Search, filtering, and sorting.
- Dashboard statistics and overdue task highlighting.

## Future Improvements

- User authentication and personal task accounts.
- Task categories and tags.
- Dark mode.
- Automated backend tests.
- Cloud deployment.

## Author

**Disha Maurya**

B.Tech Computer Science and Engineering

GitHub: [dishamaurya081-create](https://github.com/dishamaurya081-create)

---

*TaskFlow — Stay organized. One task at a time.*