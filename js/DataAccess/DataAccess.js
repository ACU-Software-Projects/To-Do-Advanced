import fs from 'fs';
import path from 'path';

let data = [];

const filePath = 'data.json';

// Load JSON data from file
function loadData() {
    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        data = JSON.parse(rawData);
        console.log("Data loaded successfully.");
    } catch (error) {
        console.error("Error loading data:", error.message);
    }
}

// Save data back to file
function saveData() {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        console.log("Data saved successfully.");
    } catch (error) {
        console.error("Error saving data:", error.message);
    }
}

// Get all users
function getAllUsers() {
    return data;
}

// Find user by email
function findUserByEmail(email) {
    return data.find(user => user.email === email);
}

// Add a new user
function addUser(user) {
    data.push(user);
    saveData();
}

// Delete a user by email
function deleteUserByEmail(email) {
    data = data.filter(user => user.email !== email);
    saveData();
}

// Get todos for a specific user
function getTodosByEmail(email) {
    const user = findUserByEmail(email);
    return user ? user.todos : [];
}

// Add a todo for a specific user
function addTodoForUser(email, todo) {
    const user = findUserByEmail(email);
    if (user) {
        user.todos.push(todo);
        saveData();
    } else {
        console.error("User not found.");
    }
}

// Mark a todo as deleted
function markTodoAsDeleted(email, todoContent) {
    const user = findUserByEmail(email);
    if (user) {
        const todo = user.todos.find(t => t.todo_content === todoContent);
        if (todo) {
            todo.is_deleted = 1;
            saveData();
        } else {
            console.error("Todo not found.");
        }
    } else {
        console.error("User not found.");
    }
}