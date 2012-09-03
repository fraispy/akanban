define(['knockout'], function (ko) {
    // var Task = function (id, step, place, index, title, notes, color, urgent, blocked, tag, person, createAt, updateAt) {
    var Task = function (id, step, place, title, notes, color, urgent, blocked, tag, person, createAt, updateAt) {
        this.id = id;
        this.step = ko.observable(step);
        this.place = ko.observable(place);
        // this.index = ko.observable(index);
        this.title = ko.observable(title);
        this.notes = ko.observable(notes);
        this.color = ko.observable(color);
        this.urgent = ko.observable(urgent);
        this.blocked = ko.observable(blocked);
        this.tag = ko.observable(tag);
        this.person = ko.observable(person);
        this.createAt = ko.observable(createAt);
        this.updateAt = ko.observable(updateAt);
    	// this.person = ko.observableArray(person);
    	// this.comments = ko.observableArray(comments);

        this.shortNotes = ko.computed(function() {
            return this.notes().substr(0, 30);
        }, this);

        this.asignee = ko.computed(function() {
            return $.trim(this.person()).length > 0 ? this.person() : 'unsign';
        }, this);

        this.cssClass = ko.computed(function() {
            cclass = "";
            if (this.color()) {
                cclass += this.color() + " ";}
            if (this.blocked()) {
                cclass += "blocked ";}
            if (this.urgent()) {
                cclass += "urgent";}
            return cclass;
        }, this);

        this.screenId = ko.computed(function() {
            return "#"+this.id;
        }, this);

        this.setPlaceholder = function() {
            ko.bindingHandlers.sortable.options = {
                placeholder: "ui-sortable-placeholder " + this.cssClass(),
                // tolerance: 'pointer',
                // forcePlaceholderSize: true,
                // distance: 20
            };
        };

        this.showEditTaskModal = function() {
            $('#edit_task_modal_id').val(this.id);
            $('#edit_task_modal_title').val(this.title());
            $('#edit_task_modal_step').val(this.step());
            $('#edit_task_modal_place').val(this.place());
            $('#edit_task_modal_urgent').val(this.urgent());
            $('#edit_task_modal_blocked').val(this.blocked());
            $('#edit_task_modal_color').val(this.color());
            $('#edit_task_modal_person').val(this.person());
            $('#edit_task_modal_tag').val(this.tag());
            $('#edit_task_modal_notes').val(this.notes());
              
            $('#edit_task_modal').modal();
        };

        this.getLocation = function(task) {
            var id = task.id;
            return $('#'+id).parent().attr('id');
        }

    };

    return Task;
});