import Task from './task.js';

export default class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.todoList = document.getElementById('todoList');
    this.ul = document.querySelector('.list-container');
    this.initListeners();
    this.renderTasks();
  }

  initListeners() {
    this.ul.addEventListener('click', (event) => {
      const li = event.target.closest('li');
      if (!li) return;
      if (event.target.classList.contains('fa-trash-can')) {
        this.handleDeleteTask(li);
      } else if (event.target.classList.contains('checkbox')) {
        this.handleToggleTaskComplete(li);
      } else {
        this.handleEditTask(li);
      }
    });
  }

  saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  renderTasks() {
    this.sortTasksByIndex();
    this.ul.innerHTML = '';
    this.tasks.forEach((task) => {
      this.ul.appendChild(this.createTaskElement(task));
    });
    this.todoList.appendChild(this.ul);
  }

  createTaskElement(task) {
    const li = document.createElement('li');
    li.innerHTML = `
      <p>
        <input class='checkbox' type='checkbox' ${task.completed ? 'checked' : ''}>
        ${task.description}
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </p>
    `;
    return li;
  }

  handleEditTask(li) {
    const task = this.getTaskFromListItem(li);
    const p = li.querySelector('p');
    const currentDescription = task.description;
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currentDescription;
    p.replaceWith(inputField);
    inputField.focus();
    inputField.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        task.description = inputField.value.trim();
        this.saveAndRenderTasks();
      }
    });
    inputField.addEventListener('blur', () => {
      task.description = inputField.value.trim();
      this.saveAndRenderTasks();
    });
  }

  handleToggleTaskComplete(li) {
    const task = this.getTaskFromListItem(li);
    const checkbox = li.querySelector('.checkbox');
    li.classList.toggle('overline');
    task.completed = checkbox.checked;
    this.saveAndRenderTasks();
  }

  handleDeleteTask(li) {
    const task = this.getTaskFromListItem(li);
    this.tasks = this.tasks.filter((t) => t.index !== task.index);
    this.reindexTasks();
    this.saveAndRenderTasks();
  }

  getTaskFromListItem(li) {
    const index = Array.from(this.ul.children).indexOf(li);
    return this.tasks[index];
  }

  sortTasksByIndex() {
    this.tasks.sort((a, b) => a.index - b.index);
  }

  reindexTasks() {
    this.tasks.forEach((task, index) => {
      task.index = index + 1;
    });
  }

  saveAndRenderTasks() {
    this.saveTasksToLocalStorage();
    this.renderTasks();
  }

  addNewTask(description) {
    const newTaskDescription = description.trim();
    if (newTaskDescription !== '') {
      const newTask = new Task(newTaskDescription, false, this.tasks.length + 1);
      this.tasks.push(newTask);
      this.saveAndRenderTasks();
    }
  }

  deleteCompletedTasks() {
    this.tasks = this.tasks.filter((task) => !task.completed);
    this.reindexTasks();
    this.saveAndRenderTasks();
  }
}
