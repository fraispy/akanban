define([ 'infrastructure/init', 'knockout', 'model/Task', 'knockout-sortable' ], function ($, ko, Task) {

    var KanbanModel = function(columns) {
        var self = this;

        this.columns = ko.observableArray(columns);
        this.lastAction = ko.observable();
        this.lastError = ko.observable();

        // this.isQueueFull = function(parent) {
        //     // return parent().length < self.maximumStudents;
        //     return parent().length < 10;
        // };

        // this.updateLastAction = function(arg) {
        //     console.log(arg);
        //     self.lastAction("Moved " + arg.item.name() + " from " + arg.sourceParent.id + " (seat " + (arg.sourceIndex + 1) + ") to " + arg.targetParent.id + " (seat " + (arg.targetIndex + 1) + ")");
        // };


        // use input text creat new task
        this.createTask = function() {
            var text = $('#newtask').val();

            var title = text.match(/^[^#@$%\^=]*/);
            if ($.trim(title).length < 1) {
                console.log('title is empty');
                return;
            } else {
                title = title[0];
            }

            var step = text.match(/\s#[^\s]+/);
            if ( step ) {
                step = step[0].substr(2).toLowerCase();
                switch (step) {
                    case 'planning':
                        step = 0;
                    break;
                    case 'design':
                        step = 1;
                    break;
                    case 'developing':
                        step = 2;
                    break;
                    case 'testing':
                        step = 3;
                    break;
                    case 'released':
                        step = 4;
                    break;
                    default:
                        step = 0;
                } 
            } else {
                step = 0;
            }
            
            var color = text.match(/\s%[^\s]+/);
            if ( color ) {
                color = color[0].substr(2);
                var colors = 'blue brown green orange red yellow purple';
                if ( !colors.match(color) ) {
                    console.log('use default color');
                    color = 'default';
                }
            } else {
                color = 'default';
            }

            var urgent = text.match(/\s\^[\s$]/);
            if ( urgent ) {
                urgent = true;
            }

            var tags = text.match(/\s\$[^\s]*/g);
            if (tags) {
                tags = tags.join().replace('/\s\$/g', '');
            }

            var person = text.match(/\s@[^\s]*/g);
            if (person) {
                console.log(person);
                person = person.join().replace('/\s\@/g', '');
            }

            var version = text.match(/\s=v[^\s]*/);
            if (version) {
                version = version[0].substr(3);
            }

            var task = { 
                projectId: 1, 
                title: title,
                step: step,
                color: color,
                urgent: urgent,
                blocked: false,
                tag: tags,
                person: person,
                version: version,
                place: 0,
                notes: ''
            };

            console.log(task);
            $.post("/api/tasks", task, function(data) {
                task = new Task(data['id'], step, 0, title, "", color, urgent, false, tags, person);
                self.columns()[task.step()].addNewTask(task, task.place());
                text = $('#newtask').val('');
            });
        };

        // use form data create new task
        this.newTask = function() {

        };

        this.editTask = function() {
            var id = $('#edit_task_modal_id').val();
            var step = $('#edit_task_modal_step').val();
            var place = $('#edit_task_modal_place').val();
            var task = this.getTask(id, step, place);

            console.log(task);

            task.title($('#edit_task_modal_title').val());
            task.urgent($('#edit_task_modal_urgent').val());
            task.blocked($('#edit_task_modal_blocked').val());
            task.color($('#edit_task_modal_color').val());
            task.person($('#edit_task_modal_person').val());
            task.tag($('#edit_task_modal_tag').val());
            task.notes($('#edit_task_modal_notes').val());

            var task = { 
                id: task.id,
                title: task.title(),
                step: task.step(),
                color: task.color(),
                urgent: task.urgent(),
                blocked: task.blocked(),
                tag: task.tag(),
                person: task.person(),
                // version: task.version(),
                place: task.place(),
                notes: task.notes()
            };

            console.log(task);
            $.post("/api/tasks", task, function(data) {      
                // 
                console.log('task saved!');
            });


            $('#edit_task_modal').modal('hide');
        };


        this.deleteTask = function() {
            var id = $('#edit_task_modal_id').val(); 
            var step = $('#edit_task_modal_step').val();
            var place = $('#edit_task_modal_place').val();
            var task = this.getTask(id, step, place);

            $.ajax({
                type: 'DELETE',
                url: '/api/tasks',
                data: {id: id},
                success: function(data) {
                    console.log('task deleted!');
                },
                dataType: 'json'
            });

            self.columns()[step].removeTask(task);
            $('#edit_task_modal').modal('hide');
        };

        this.getTask = function(id, step, place) {            
            var column = this.columns()[step];
            return column.findTask(id, place);
        };
    };

    return KanbanModel;

});
