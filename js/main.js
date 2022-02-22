// Gets all elements
const elTodoForm = findElement('.todo__form');
const elTodoAddInput = findElement('.todo__add-input');
const elTodoList = findElement('.todos');
const elTodoTemplate = findElement('#todo-template').content;
const elBtns = findElement('.btns');
const elAllBtnInfo = findElement('.btn-all-text');
const elCompletedBtnInfo = findElement('.btn-completed-text');
const elUnCompletedBtnInfo = findElement('.btn-uncompleted-text');



// Global todos array
let todos = JSON.parse(window.localStorage.getItem('todos')) || [];

speech.addEventListener('click', ()=>{
	const recording = new webkitSpeechRecognition();
	
	recording.lang = 'en-US'
	
	recording.onresult = (evt) => {
		const speechValue = (evt.results[0][0].transcript)
		
		const speechObj = {
			id: todos[todos.length -1]?.id + 1 || 0,
			title: speechValue,
			isCompleted: false
		};
		
		todos.push(speechObj);
		console.log(todos);
		renderTodos(todos, elTodoList)
	}

	recording.onend = () => {
		console.log('goodbye world');
	}

	recording.start();
})


const renderInfo = (array) => {
	elAllBtnInfo.textContent = array.length;
	
	const completedTodos = array.filter((todo) => todo.isCompleted);
	
	elCompletedBtnInfo.textContent = completedTodos.length;
	elUnCompletedBtnInfo.textContent = array.length - completedTodos.length;
};

// Renders todos
const renderTodos = (array, node) => {
	node.innerHTML = null;
	
	renderInfo(array);
	
	// Creates fragment
	const todosFragment = document.createDocumentFragment();
	
	array.forEach((todo) => {
		// Clone template for every todo
		const todoTemplate = elTodoTemplate.cloneNode(true);
		
		// Gets elements from template
		const elTodoTitle = findElement('.todo__title', todoTemplate);
		const elTodoInput = findElement('.todo__check-input', todoTemplate);
		const elTodoBtn = findElement('.todo__delete-btn', todoTemplate);
		const elTodoBtns = findElement('.todo__edit-btn', todoTemplate);
		
		// Assigns todo's values
		elTodoTitle.textContent = todo.title;
		elTodoInput.dataset.todoId = todo.id;
		elTodoBtn.dataset.todoId = todo.id;
		elTodoBtns.dataset.todoId = todo.id;
		
		// Checks completed and uncompleted todos
		if (todo.isCompleted) {
			elTodoInput.checked = true;
			elTodoTitle.style.textDecoration = 'line-through';
			elTodoTitle.style.color = 'red'
		} else {
			elTodoInput.checked = false;
		}
		
		// Appends to fragment
		todosFragment.appendChild(todoTemplate);
	});
	
	// Appends to element from DOM
	node.append(todosFragment);
};

renderTodos(todos, elTodoList);

// Submits todos form
elTodoForm.addEventListener('submit', (evt) => {
	evt.preventDefault();
	
	const newTodoTitle = elTodoAddInput.value.trim();
	
	// Early return
	if (!newTodoTitle) {
		return;
	}
	
	// New todo
	const newTodo = {
		id: new Date().getMilliseconds(),
		title: newTodoTitle,
		isCompleted: false,
	};
	
	todos.unshift(newTodo);
	
	renderTodos(todos, elTodoList);
	window.localStorage.setItem('todos', JSON.stringify(todos));
	
	// Clears input after new todo
	elTodoAddInput.value = null;
});

const handleDeleteTodo = (id, array) => {
	const foundTodoIndex = array.findIndex((item) => item.id === id);
	
	// Removes clicked element
	array.splice(foundTodoIndex, 1);
	
	renderTodos(array, elTodoList);
	
	window.localStorage.setItem('todos', JSON.stringify(array));
};

const handleEditTodo = (id, array) => {
	const foundTodoIndex = array.findIndex((item) => item.id === id);
	
	array[foundTodoIndex].title = prompt("Iltimos yangi qiymatni kiriting!")
	
	window.localStorage.setItem('todos', JSON.stringify(array));
	
	renderTodos(array, elTodoList);
};


const handleCheckTodo = (id, array) => {
	const foundTodo = array.find((item) => item.id === id);
	
	// Changes object from array of changed element
	foundTodo.isCompleted = !foundTodo.isCompleted;
	
	window.localStorage.setItem('todos', JSON.stringify(array));
	
	renderTodos(array, elTodoList);
};

// Listens list of todos
elTodoList.addEventListener('click', (evt) => {
	// Delete button clicked
	if (evt.target.matches('.todo__delete-btn')) {
		const clickedTodoId = Number(evt.target.dataset.todoId);
		
		handleDeleteTodo(clickedTodoId, todos);
	}
	
	if (evt.target.matches('.todo__edit-btn')) {
		const editedTodoId = Number(evt.target.dataset.todoId);
		
		handleEditTodo(editedTodoId, todos);
	}
	
	// Check input clicked
	if (evt.target.matches('.todo__check-input')) {
		const changedTodoId = Number(evt.target.dataset.todoId);
		
		handleCheckTodo(changedTodoId, todos);
	}
});

elBtns.addEventListener('click', (evt) => {
	if (evt.target.matches('.btn-all')) {
		renderTodos(todos, elTodoList);
	}
	
	if (evt.target.matches('.btn-completed')) {
		const completedTodos = todos.filter((todo) => todo.isCompleted);
		
		renderTodos(completedTodos, elTodoList);
	}
	
	if (evt.target.matches('.btn-uncompleted')) {
		const uncompletedTodos = todos.filter((todo) => !todo.isCompleted);
		
		renderTodos(uncompletedTodos, elTodoList);
	}
	
	if (evt.target.matches('.btn-clear')) {
		window.localStorage.removeItem('todos');
		
		todos = [];
		
		renderTodos(todos, elTodoList);
	}
});