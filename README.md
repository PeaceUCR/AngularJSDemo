This template is copied from https://github.com/angular/angular-seed

AngularJS Demo for custom directive & filter and $q.defer()

Please care the use of $scope and two-way data binding,

not all changes on $scope properites will update the view, sometime they run outside the $digest cycle,
so we need manually call $apply, especially in event handler (for details refer to login.js)