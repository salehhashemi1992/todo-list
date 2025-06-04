/* ---------- داده‌ها ---------- */
let todos = [];

/* ---------- افزودن ---------- */
function addTodo() {
    const inp = document.getElementById('todoInput');
    const text = inp.value.trim();
    if (!text) return;

    const todo = { id: Date.now(), text, completed:false };
    todos.push(todo);
    inp.value = '';
    updateUI();
}

/* ---------- ساخت آیتم ---------- */
function createTodoElement(todo){
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = todo.id;

    /* محتوای پویا */
    li.innerHTML = `
        <input type="checkbox" class="form-check-input me-2"
               ${todo.completed ? 'checked':''}
               onchange="toggleComplete(${todo.id})">
        <span class="${todo.completed?'completed':''} flex-grow-1"
              ondblclick="enableEdit(${todo.id})">${todo.text}</span>
        <button class="btn btn-danger btn-sm ms-2"
                onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    return li;
}

/* ---------- ویرایش متن ---------- */
function enableEdit(id){
    const liSpan = document.querySelector(`li[data-id="${id}"] span`); // Use normal backticks
    if (!liSpan) {
        // Correctly formatted template literal for console.warn
        console.warn(`Span element not found for todo item ${id}. Possibly already in edit mode or item removed.`);
        return;
    }
    const oldText = liSpan.innerText;

    /* جایگزینی input */
    const input = document.createElement('input');
    input.type  = 'text';
    input.className = 'form-control';
    input.value = oldText;
    input.style.flexGrow = '1';

    /* ذخیره در blur یا Enter */
    input.addEventListener('blur', ()=>saveEdit(id,input));
    input.addEventListener('keypress', e=>{
        if(e.key==='Enter') input.blur();
    });

    // Only proceed if liSpan is valid
    if (liSpan) {
        liSpan.replaceWith(input);
        input.focus();
    }
}

function saveEdit(id, inputEl){
    const newText = inputEl.value.trim();
    if (newText){
        todos = todos.map(t=> t.id===id ? {...t,text:newText}:t);
    }
    updateUI();
}

/* ---------- تغییر وضعیت ---------- */
function toggleComplete(id){
    todos = todos.map(t=> t.id===id ? ({...t,completed:!t.completed}) : t);
    updateUI();
}

/* ---------- حذف ---------- */
function deleteTodo(id){
    todos = todos.filter(t=>t.id!==id);
    updateUI();
}

/* ---------- پاک‌کردن همه ---------- */
function clearAll(){
    todos = [];
    updateUI();
}

/* ---------- شمارنده ---------- */
function updateStats(){
    const done = todos.filter(t=>t.completed).length;
    const remaining = todos.length - done;
    document.getElementById('stats').innerText =
        \`Completed: ${done}  |  Remaining: ${remaining}\`;
}

/* ---------- رندر UI ---------- */
function updateUI(){
    const ul = document.getElementById('todoList');
    ul.innerHTML = '';
    todos.forEach(t=>ul.appendChild(createTodoElement(t)));
    updateStats();
}

/* ---------- ورودی Enter ---------- */
document.getElementById('todoInput').addEventListener('keypress',e=>{
    if(e.key==='Enter') addTodo();
});
