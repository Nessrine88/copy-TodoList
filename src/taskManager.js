import Task from './task.js';

export default class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  }

  saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  renderTasks() {
    const todoList = document.getElementById('todoList');
    const ul = document.querySelector('.list-container');

    this.sortTasksByIndex();

    ul.innerHTML = '';

    this.tasks.forEach((task) => {
      const li = this.createTaskElement(task);

      const optionIcon = li.querySelector('.fa-ellipsis-vertical');
      optionIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        optionIcon.classList.replace('fa-ellipsis-vertical', 'fa-trash-can');
        li.style.backgroundColor = '#FFF9C4';

        const trashIcon = li.querySelector('.fa-trash-can');
        trashIcon.addEventListener('click', () => {
          ul.removeChild(li);
          this.deleteTask(task);
        });
      });

      const checkbox = li.querySelector('.checkbox');
      checkbox.addEventListener('click', (event) => {
        event.stopPropagation();
        li.classList.toggle('overline');
        task.completed = checkbox.checked;
        this.saveAndRenderTasks();
      });

      li.addEventListener('click', () => {
        this.editTask(li, task);
      });

      ul.appendChild(li);
    });

    todoList.appendChild(ul);
  }
  /* eslint-disable */

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

  editTask(li, task) {
    const p = li.querySelector('p');
    const currentDescription = task.description;

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currentDescription;

    p.replaceWith(inputField);
    inputField.focus();

    const saveChanges = () => {
      task.description = inputField.value.trim();
      this.saveAndRenderTasks();
    };

    inputField.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        saveChanges();
      }
    });

    inputField.addEventListener('blur', saveChanges);
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

  deleteTask(taskToDelete) {
    this.tasks = this.tasks.filter((task) => task.index !== taskToDelete.index);
    this.reindexTasks();
    this.saveAndRenderTasks();
  }

  deleteCompletedTasks() {
    this.tasks = this.tasks.filter((task) => !task.completed);
    this.reindexTasks();
    this.saveAndRenderTasks();
  }

  sortTasksByIndex() {
    this.tasks.sort((a, b) => a.index - b.index);
  }

  reindexTasks() {
    this.tasks.forEach((task, index) => {
      task.index = index + 1;
    });
  }
}
