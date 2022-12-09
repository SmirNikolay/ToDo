(function() {
    //создаем и возвращаем заголовок приложения
    function createAppTitle (title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    };

    //создаем и возвращаем форму для создания дел
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.disabled = true;

        input.addEventListener('input', function() {
            button.disabled = false;

            if(input.value === '') {
                button.disabled = true;
            }
        });


        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);
        return {
            form,
            input,
            button,
        };
    };

    //создаем и возвращаем список элементов 
    function createTodoList () {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    };

    function createTodoItem(name, id, done) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');
        let itemSpan = document.createElement('span')


        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        if(done === true) {
            item.setAttribute("data-action", "done");
            item.classList.add('list-group-item-success');
        }
        item.setAttribute("id", id)
        itemSpan.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';


        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(itemSpan);
        item.append(buttonGroup);


        return {
            item,
            itemSpan,
            doneButton,
            deleteButton,
        }
    }

    function createTodoApp ( container, title = 'Список дел') {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todolist = createTodoList();
        
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todolist);

        let tasks = [];

        if(localStorage.getItem('tasks')) {
            tasks = JSON.parse(localStorage.getItem('tasks'))
        }

        tasks.forEach( function(task) {
            let todoItem = createTodoItem(task.text, task.id, task.done);
            let id = Number(todoItem.item.getAttribute('id'));


            todoItem.doneButton.addEventListener('click', function () {
                if(todoItem.item.dataset.action !== "done") {
                    todoItem.item.classList.add('list-group-item-success');
                    todoItem.item.setAttribute("data-action", "done")
                } else if (todoItem.item.dataset.action === "done"){
                    todoItem.item.classList.remove('list-group-item-success');
                    todoItem.item.removeAttribute("data-action");
                };
                let task = tasks.find(function(task) {
                    if(task.id === id) {
                        return true;
                    };
                });
                task.done = !task.done;
                saveToLocalStorage(tasks)
            });


            todoItem.deleteButton.addEventListener('click', function () {
                if(confirm('Вы уверены?')) {
                    tasks = tasks.filter((task) => task.id !== id);
                    todoItem.item.remove();
                    saveToLocalStorage(tasks)
                };
            });


            todolist.append(todoItem.item);
            todoItemForm.input.focus();
            todoItemForm.button.disabled = true;
            todoItemForm.input.value = '';
            saveToLocalStorage(tasks)
        });



        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();

            if(!todoItemForm.input.value) {
                return;
            };

            let newTask = {
                id: Date.now(),
                text: todoItemForm.input.value,
                done: false,
            };

            let todoItem = createTodoItem(todoItemForm.input.value, newTask.id, newTask.done);
            let id = Number(todoItem.item.getAttribute('id'));


            tasks.push(newTask);


            todoItem.doneButton.addEventListener('click', function () {
                if(todoItem.doneButton.dataset.action !== "done") {
                    todoItem.item.classList.add('list-group-item-success');
                    todoItem.doneButton.setAttribute("data-action", "done")
                } else if (todoItem.doneButton.dataset.action === "done"){
                    todoItem.item.classList.remove('list-group-item-success');
                    todoItem.doneButton.removeAttribute("data-action");
                };
                let task = tasks.find(function(task) {
                    if(task.id === id) {
                        return true;
                    };
                });
                task.done = !task.done;
                saveToLocalStorage(tasks)
            });


            todoItem.deleteButton.addEventListener('click', function () {
                if(confirm('Вы уверены?')) {
                    tasks = tasks.filter((task) => task.id !== id);
                    todoItem.item.remove();
                    saveToLocalStorage(tasks)
                };
            });


            todolist.append(todoItem.item);
            todoItemForm.input.focus();
            todoItemForm.button.disabled = true;
            todoItemForm.input.value = '';
            saveToLocalStorage(tasks)
        });
    };

    function saveToLocalStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }
    
    window.createTodoApp = createTodoApp;
})();