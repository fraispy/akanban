define(['knockout'], function (ko) {

    var Person = function (name) {
        this.name = ko.observable(name);
    };

    return Person;
});