let todos = [];
let currentFilter = 'all';
let currentCategory = '';
let currentSort = 'date';

// Load todos from localStorage when page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
        renderTodos();
    }
    updateStats();
});

function addTodo() {
    const input = document.getElementById('todoInput');
    const category = document.getElementById('categorySelect');
    const priority = document.getElementById('prioritySelect');
    const dueDate = document.getElementById('dueDateInput');
    const text = input.value.trim();
    
    if (text) {
        todos.push({
            id: Date.now(),
            text: text,
            completed: false,
            category: category.value || 'uncategorized',
            priority: priority.value,
            dueDate: dueDate.value,
            createdAt: new Date().toISOString()
        });
        
        input.value = '';
        category.value = '';
        priority.value = 'low';
        dueDate.value = '';
        
        saveTodos();
        renderTodos();
        updateStats();
    }
}

document.getElementById('todoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveTodos();
    renderTodos();
    updateStats();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateStats();
}

function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    const newText = prompt('Edit task:', todo.text);
    
    if (newText !== null && newText.trim() !== '') {
        todos = todos.map(t => {
            if (t.id === id) {
                return { ...t, text: newText.trim() };
            }
            return t;
        });
        
        saveTodos();
        renderTodos();
    }
}

function filterTodos(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderTodos();
}

function filterByCategory(category) {
    currentCategory = category;
    renderTodos();
}

function sortTodos(sortBy) {
    currentSort = sortBy;
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    let filteredTodos = todos;

    // Apply filters
    if (currentFilter === 'active') {
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = filteredTodos.filter(todo => todo.completed);
    }

    if (currentCategory) {
        filteredTodos = filteredTodos.filter(todo => todo.category === currentCategory);
    }

    // Apply sorting
    filteredTodos.sort((a, b) => {
        switch (currentSort) {
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'dueDate':
                return new Date(a.dueDate) - new Date(b.dueDate);
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <p>No tasks found</p>
            </div>
        `;
        return;
    }
    
    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        const dueDate = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date';
        
        todoItem.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                onchange="toggleTodo(${todo.id})">
            <div class="todo-content">
                <span class="todo-text">${todo.text}</span>
                <div class="todo-meta">
                    <span>${todo.category}</span>
                    <span class="priority-badge priority-${todo.priority}">
                        ${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                    </span>
                    <span>Due: ${dueDate}</span>
                </div>
            </div>
            <div class="todo-actions">
                <button class="edit-btn" onclick="editTodo(${todo.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        `;
        
        todoList.appendChild(todoItem);
    });
}