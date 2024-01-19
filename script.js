document.addEventListener('DOMContentLoaded', () => {
  const allBoxes = document.querySelectorAll('.box');
  const allTasks = document.querySelectorAll('.task');
  const todoBox = document.querySelector('#to-do');

  //store tasks
  let tasks;
  if (localStorage.tasks != null) {
    tasks = JSON.parse(localStorage.tasks);
  } else {
    tasks = [];
  }

  //save tasks to local storage with error handling
  function saveTasks() {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to local storage:', error);
    }
  }

  //create a new task element
  function createTaskElement(taskText) {
    const newTask = document.createElement('p');
    newTask.classList.add('task');
    newTask.setAttribute('draggable', 'true');
    newTask.innerHTML = taskText;

    newTask.addEventListener('dragstart', () => {
      newTask.classList.add('is-dragging');
    });
    newTask.addEventListener('dragend', () => {
      newTask.classList.remove('is-dragging');
      saveTasks(); // Save tasks after a task is moved
    });

    // double-click event to edit task
    newTask.addEventListener('dblclick', () => {
      const updatedTaskText = prompt('Edit task:', taskText);

      if (updatedTaskText !== null) {
        newTask.innerHTML = updatedTaskText;
        tasks[tasks.indexOf(taskText)] = updatedTaskText;
        saveTasks(); // Save tasks after editing
      }
    });

    return newTask;
  }

  //load tasks from local storage
  function loadTasks() {
    tasks.forEach(taskText => {
      const newTask = createTaskElement(taskText);
      todoBox.appendChild(newTask);
    });
  }

  //load tasks from local storage when the page is loaded
  loadTasks();

  // add new task
  const form = document.querySelector('#add-form');
  const input = document.querySelector('#todo-input');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const newTaskText = input.value;

    if (!newTaskText) return;

    const newTask = createTaskElement(newTaskText);
    todoBox.appendChild(newTask);

    tasks.push(newTaskText);
    saveTasks();
    input.value = '';
  });

  allTasks.forEach(task => {
    task.addEventListener('dragstart', () => {
      task.classList.add('is-dragging');
    });
    task.addEventListener('dragend', () => {
      task.classList.remove('is-dragging');
      saveTasks();
    });

    // double-click event to edit task
    task.addEventListener('dblclick', () => {
      const updatedTaskText = prompt('Edit task:', task.innerHTML);

      if (updatedTaskText !== null) {
        task.innerHTML = updatedTaskText;
        tasks[tasks.indexOf(task.innerHTML)] = updatedTaskText;
        saveTasks();
      }
    });
  });

  allBoxes.forEach(box => {
    box.addEventListener('dragover', (e) => {
      e.preventDefault();

      const curTask = document.querySelector('.is-dragging');
      box.appendChild(curTask);
      saveTasks();
    });
  });
});
