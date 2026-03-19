const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        todoInput.focus();
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);
    saveTodos();
    todoInput.value = '';
    renderTodos();
    todoInput.focus();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('activeCount').textContent = active;
    document.getElementById('completedCount').textContent = completed;
}

function renderTodos() {
    let filteredTodos = todos;

    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<div class="empty-state"><span class="emoji">🎉</span>ამოცანები არ არის</div>';
    } else {
        todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <input
                    type="checkbox"
                    class="checkbox"
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">წაშლა</button>
            </li>
        `).join('');
    }

    updateStats();
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

renderTodos();
