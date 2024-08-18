let ctr = 1;
let todos = [];

// Function to load todos from localStorage
function loadTodos() {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) {
        todos = savedTodos;
        ctr = todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
    }
}

// Function to save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
    const input = document.querySelector("#input");
    const title = input.value.trim();
    
    if (title === "") {
        alert("Please enter a todo item.");
        return; // Stop execution if input is empty
    }

    todos.push({
        id: ctr++,
        title: title,
        completed: false // Initialize as not completed
    });
    input.value = ""; // Clear the input field after adding
    saveTodos(); // Save todos to localStorage
    render(todos);
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos(); // Save todos to localStorage
    render(todos);
}

function editTodo(id) {
    const newTitle = prompt("Edit your todo:");
    if (newTitle && newTitle.trim() !== "") {
        todos = todos.map(todo => todo.id === id ? { ...todo, title: newTitle } : todo);
        saveTodos(); // Save todos to localStorage
        render(todos);
    }
}

function toggleComplete(id) {
    todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
    saveTodos(); // Save todos to localStorage
    render(todos);
}

function render(todos) {
    const todoList = document.getElementById('root');
    todoList.innerHTML = ''; // Clear the list

    todos.forEach(todo => {
        const div = document.createElement('div');
        div.classList.add('todo-item'); // Add class for styling

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `todo-${todo.id}`;
        checkbox.checked = todo.completed; // Set checkbox state
        checkbox.style.display = 'none'; // Hide the default checkbox
        checkbox.onclick = () => toggleComplete(todo.id); // Handle toggle

        const customCheckbox = document.createElement('label');
        customCheckbox.className = 'custom-checkbox';
        customCheckbox.setAttribute('for', `todo-${todo.id}`); // Link the label to the checkbox

        const span = document.createElement('span');
        span.textContent = todo.title;
        if (todo.completed) {
            span.classList.add('completed'); // Add class for completed todos
        }

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editTodo(todo.id);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTodo(todo.id);

        // Append checkbox, custom checkbox, title, edit button, and delete button to the div
        div.appendChild(checkbox);
        div.appendChild(customCheckbox);
        div.appendChild(span);
        div.appendChild(editButton);
        div.appendChild(deleteButton);

        todoList.appendChild(div);
    });
}

// Load todos from localStorage when the page is loaded
loadTodos();
render(todos);
 