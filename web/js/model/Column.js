define(['knockout'], function (ko) {

    var Column = function (index, title, kan, ban, isLast, queueName, inProgressName, taskLimit, inProgressLimit) {
        var self = this;

        this.index = index;
        this.title = ko.observable(title);
        this.cssClass = isLast? "kanban-column well ko_container ui-sortable last" : "kanban-column well ko_container ui-sortable";
        this.kan = ko.observableArray(kan);
        this.ban = ko.observableArray(ban);
        this.queueName = ko.observable(queueName);
        this.inProgressName = ko.observable(inProgressName);
        this.taskLimit = ko.observable(taskLimit);
        this.inProgressLimit = ko.observable(inProgressLimit);

        this.kanId = ko.computed(function() {
            return 'queue_'+self.index+'_0';
        });

        this.banId = ko.computed(function() {
            return 'queue_'+self.index+'_1';
        });

        this.addNewTask = function(newTask, place) {
            if (place == 0 ) {
                this.kan.push(newTask);
            } else {
                this.ban.push(newTask);
            }
        };

        this.showNewTaskModal = function() {
            $('#new_task_modal_step').val(this.title());
            $('#new_task_modal').modal();
        };

        this.showEditStepModal = function() {
            alert('showEditStepModal');
        };

        this.findTask = function(id, place) {
            var tasks = null;
            if (place == 0 ) {
                tasks = this.kan();
            } else {
                tasks = this.ban();
            }
            for (var i = 0; i < tasks.length; i++) {
                if ( tasks[i].id == id ) {
                    return tasks[i];
                }
            };
        };

        this.removeTask = function(task) {
            this.kan.remove(task);
            this.ban.remove(task);
        };

        this.afterMove = function(arg) {
            var task = arg.item;
            var to = task.getLocation(task).split("_");
            console.log('update task move form location '+task.step()+' '+task.place()+' to location '+to[1]+' '+to[2]);
            task.step(to[1]);
            task.place(to[2]);
            self.updateTask(task);
        };

        this.updateTask = function(task) {
            var data = { 
                id: task.id,
                title: task.title(),
                step: task.step(),
                color: task.color(),
                urgent: task.urgent(),
                blocked: task.blocked(),
                tags: task.tag(),
                person: task.person(),
                // version: task.version(),
                place: task.place(),
                notes: task.notes()
            };

            $.post("/api/tasks", data, function(data) {      
                // 
                console.log('task update success!');
            });
        };

    };

    return Column;
});