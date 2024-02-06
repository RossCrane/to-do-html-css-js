import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import {
	getDatabase,
	ref,
	push,
	onValue,
	update,
	remove,
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
	databaseURL: 'https://playground-a07ca-default-rtdb.firebaseio.com/',
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const tasksInDB = ref(database, 'tasks');

const inputFieldEl = document.getElementById('input-field');
const addButtonEl = document.getElementById('add-button');
const tasksListEl = document.getElementById('tasks-list');

addButtonEl.addEventListener('click', function () {
	let inputValue = inputFieldEl.value;
	if (inputValue.trim() !== '') {
		let task = {
			name: inputValue,
			completed: false,
		};

		push(tasksInDB, task);
	}

	clearInputFieldEl();
});

onValue(tasksInDB, function (snapshot) {
	if (snapshot.exists()) {
		let tasksArray = Object.entries(snapshot.val());

		clearTasksListEl();

		tasksArray.forEach(([taskId, taskDetails]) => {
			appendItemToTasksListEl(taskId, taskDetails);
		});
	} else {
		tasksListEl.innerHTML = 'No tasks here... yet';
	}
});

function clearTasksListEl() {
	tasksListEl.innerHTML = '';
}

function clearInputFieldEl() {
	inputFieldEl.value = '';
}

function appendItemToTasksListEl(taskId, taskDetails) {
	let { name, completed } = taskDetails;

	let taskEl = document.createElement('li');
	let taskNameEl = document.createElement('span');
	taskNameEl.textContent = name;
	taskEl.appendChild(taskNameEl);

	taskNameEl.className = completed ? 'completed-task' : '';
	taskNameEl.addEventListener('click', function (event) {
		event.stopPropagation();
		toggleTaskCompletion(taskId, !completed);
	});

	// Delete button
	let deleteBtn = document.createElement('button');
	deleteBtn.textContent = 'Delete';
	deleteBtn.className = 'delete-btn';
	deleteBtn.addEventListener('click', function (event) {
		event.stopPropagation();
		deleteTask(taskId);
	});

	taskEl.appendChild(deleteBtn);

	tasksListEl.append(taskEl);
}

function deleteTask(taskId) {
	let taskRef = ref(database, `tasks/${taskId}`);
	remove(taskRef);
}

function toggleTaskCompletion(taskId, completed) {
	let taskRef = ref(database, `tasks/${taskId}`);
	update(taskRef, { completed });
}
