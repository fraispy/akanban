require.config({
    paths: {
        'bootstrap': 'libs/bootstrap.min',
        'jquery': 'libs/jquery-1.8.0.min',
        'jquery-ui': 'libs/jquery-ui-1.8.23.custom.min',
        'jquery.json': 'libs/jquery.json-2.3.min',
        'knockout': 'libs/knockout-2.1.0',
        'knockout-sortable': 'libs/knockout-sortable'
    }
});

require(['knockout', 'viewmodel/kanbanmodel', 'model/Column', 'model/Task'], function (ko, KanbanModel, Column, Task, binder) {

    // var tasks = [
    //     new Task(1, 0, 0, "Task one", "some desc about Task One 本例主要为刚登陆SAE后台，突然发现自己的云豆变成了9千1百多，昨天还一万多呢，刷新几遍后，发现又少了几十个，云豆支出记录里面也没有显示，访问量也正常。求解，这样下去，云豆很快就消耗光了。咋回事啊？", "blue", null, true, "new test css", "bob, green"),
    //     new Task(2, 1, 1, "Task Two", "some desc about Task Two", "red", true, true),
    //     new Task(3, 2, 1, "Task Three", "some desc about Task Three", "green", null, true),
    //     new Task(4, 3, 0, "Task Four", "some desc about Task Four", ""),
    // ];

    var columns = [
        new Column(0, "Planning", [], []),
        new Column(1, "Design", [], []),
        new Column(2, "Developing", [], []),
        new Column(3, "Testing", [], []),
        new Column(4, "Released", [], [], true)
    ];

    var tasks = new Array();
    $.getJSON("/api/projects/1", function(data) {
        console.log(data.tasks);
        for (var i = 0; i < data.tasks.length; i++) {
            var task = data.tasks[i];              
            tasks.push(new Task(task.id, task.step, task.place, task.title, task.notes, task.color, task.urgent, task.blocked, task.tag, task.person));
        };
        console.log(tasks.length);

        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            columns[task.step()].addNewTask(task, task.place());
        };
    });

    var kbm = new KanbanModel(columns);


    ko.applyBindings(kbm);
    $('#steps').show();

});