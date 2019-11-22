var app = angular.module('myApp', ['ngRoute']);


app.config(function ($routeProvider) {
  $routeProvider

    // route for the Userverwaltung page
    .when('/', {
      templateUrl: 'webpages/Mitarbeiterverwaltung.html',
      controller: 'myCtrl'
    })

    // route for the employeeregistration page
    .when('/registerEmployee', {
      templateUrl: 'webpages/EmployeeRegistrationPage.html',
      controller: 'registrationController'
    })
    .when('/showEmployee', {
      templateUrl: 'webpages/EmployeeInformationPage.html',
      controller: 'informationController'
    })
    .when('/editEmployee', {
      templateUrl: 'webpages/EmployeeEditPage.html',
      controller: 'editController'
    });
});

app.controller('myCtrl', function ($scope, $http, $location,CurrentEmployee) {

 // $http.defaults.headers.get.Authorization = "Basic " + localStorage.getItem("google-token");

  $scope.newEmployee = {
    'id_employee': null,
    'forename': null,
    'surname': null,
    'dateOfBirth': null,
    'svn': null,
    'uid': null,
    'bankAccountNumber': null,
    'email': null,
    'phonenumber': null,
    'addressLine1': null,
    'addressLine2': null,
    'postCode': null,
    'city': null,
    'country': null
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
        $scope.newEmployee.id_employee = response.data.id_Employee;
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
  $scope.showEmployee = function (employee) {
   CurrentEmployee.setCurrentEmployee(employee);
    $location.path('/showEmployee');
  };
  $scope.editEmployee = function (employee) {
    CurrentEmployee.setCurrentEmployee(employee);
    $location.path('/editEmployee');
  };
});

app.controller('registrationController', function ($scope,CurrentEmployee,$location) {
  $scope.message = 'Look! I am a page.';
});

app.controller('editController', function ($scope,CurrentEmployee,$location,$http) {
  $scope.currentEmployee = CurrentEmployee.getCurrentEmployee();

  $scope.updateEmployee = function () {
    $scope.allEmployees.splice($scope.allEmployees.indexOf($scope.currentEmployee), 1);
    $scope.allEmployees.push($scope.currentEmployee);
    /*
    $http.put('/api/employees/' + $scope.currentEmployee.id_employee)
      .then(function success(response) {
        $scope.allEmployees.splice($scope.allEmployees.indexOf(currentEmployee), 1);
        $scope.allEmployees.push($scope.currentEmployee);
      }, function error(response) {
        console.log("error"+ response.data);
      });
      */
  };
  $scope.cancelView = function (){
    $location.path('/');
  };
});

app.controller('informationController', function ($scope,CurrentEmployee,$location) {
  $scope.currentEmployee = CurrentEmployee.getCurrentEmployee();

  $scope.editEmployee = function (employee){
    $location.path('/editEmployee');
  };
  $scope.cancelView = function (){
     $location.path('/');
   };
});

app.factory('CurrentEmployee', function () {

  var currentEmployee = {
    'id_employee': null,
    'forename': null,
    'surname': null,
    'dateOfBirth': null,
    'svn': null,
    'uid': null,
    'bankAccountNumber': null,
    'email': null,
    'phonenumber': null,
    'addressLine1': null,
    'addressLine2': null,
    'postCode': null,
    'city': null,
    'country': null
  };

  return {
      getCurrentEmployee: function () {
          return currentEmployee;
      },
      setCurrentEmployee: function (newCEmp) {
        currentEmployee = newCEmp;
      }
  };
});