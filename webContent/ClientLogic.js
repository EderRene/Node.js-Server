var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider

      // route for the Userverwaltung page
      .when('/', {
          templateUrl : 'pages/Mitarbeiterverwaltung.html',
          controller  : 'mainController'
      })

      // route for the employeeregistration page
      .when('/about', {
          templateUrl : 'pages/EmployeeRegistrationPage.html',
          controller  : 'aboutController'
      });
});

app.controller('myCtrl', function ($scope, $http) {

  $scope.newEmployee = {
    'id_employee': 4,
    'forename': 'Max',
    'surname': 'Mustermann',
    'dateOfBirth': null,
    'id_Address': 1,
    'svn': "0123945",
    'uid': null,
    'bankAccountNumber': '1234455',
    'email': '@gmail',
    'phonenumber': '2030404',
    'addressLine1': "Fuernitz",
    'addressLine2': null,
    'postCode': 9034,
    'city': 'fritz',
    'country': 'Austria'
  };

  $scope.getEmployees = function () {
    $http.get('/api/employees')
      .then(function mySuccess(response) {
        $scope.allEmployees = response.data;
      }, function myError(response) {
        alert('Could not get employees:' + response.data);
      });
  };

  $scope.createEmployee = function () {
    $http.post('/api/employees', $scope.newEmployee)
      .then(function (response) {
        $scope.allEmployees.push($scope.newEmployee);
      }, function (response) {
        console.error(response);
        alert('Could not register user:' + response.data);
      });
  }

  $scope.deleteEmployee = function (employee) {
    $http.delete('/api/employees/' + employee.id_employee)
      .then(function success(response) {

        $scope.allEmployees.splice($scope.allEmployees.indexOf(employee), 1);

      }, function error(response) {
        console.log("error");
      });
  };
});

app.controller('registrationController', function($scope) {
  $scope.message = 'Look! I am a page.';
});


