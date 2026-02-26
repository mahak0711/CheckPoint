// Initialize Supabase client
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

let todos = [];

// Fetch todos from Supabase
async function fetchTodos() {
    const { data, error } = await db
        .from('todos')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching todos:', error);
        return;
    }

    todos = data;
    render(todos);
}

async function addTodo() {
    const input = document.querySelector("#input");
    const title = input.value.trim();
    
    if (title === "") {
        alert("Please enter a todo item.");
        return; // Stop execution if input is empty
    }

    const { error } = await db
        .from('todos')
        .insert([{ title: title, completed: false }]);

    if (error) {
        console.error('Error adding todo:', error);
        alert('Error adding todo');
    } else {
        input.value = ""; // Clear the input field after adding
        fetchTodos();
    }
}

async function deleteTodo(id) {
    const { error } = await db
        .from('todos')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting todo:', error);
        alert('Error deleting todo');
    } else {
        fetchTodos();
    }
}

async function editTodo(id) {
    const newTitle = prompt("Edit your todo:");
    if (newTitle && newTitle.trim() !== "") {
        const { error } = await db
            .from('todos')
            .update({ title: newTitle })
            .eq('id', id);

        if (error) {
            console.error('Error editing todo:', error);
            alert('Error editing todo');
        } else {
            fetchTodos();
        }
    }
}

async function toggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const { error } = await db
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

    if (error) {
        console.error('Error toggling complete:', error);
        alert('Error updating todo');
    } else {
        fetchTodos();
    }
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

// Initial fetch
fetchTodos();
