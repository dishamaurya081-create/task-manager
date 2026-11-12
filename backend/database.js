
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the SQLite database
const dbPath = path.join(__dirname, '..', 'database', 'tasks.db');

const db = new sqlite3.Database(dbPath, (error) => {
    if (error) {
        console.error('Database connection failed:', error.message);
    } else {
        console.log('Connected to SQLite database successfully!');
    }
});

// Create the tasks table
db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        due_date TEXT,
        priority TEXT DEFAULT 'Medium'
            CHECK(priority IN ('Low', 'Medium', 'High')),
        status TEXT DEFAULT 'Pending'
            CHECK(status IN ('Pending', 'Completed')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (error) => {
    if (error) {
        console.error('Error creating tasks table:', error.message);
    } else {
        console.log('Tasks table created or already exists!');
    }
});

// Export database connection
module.exports = db;
