var app = angular.module('myApp', ['ngRoute','ngAnimate', 'ngSanitize', 'ui.bootstrap']);


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
    })
    .when('/enterWorkday',{
      templateUrl: 'webpages/enterWorkday.html',
      controller: 'enterWorkdayController'
    })
    .when('/addCamp', {
      templateUrl: 'webpages/CampRegistrationPage.html',
      controller: 'CampRegistrationController'
    });
});

app.controller('myCtrl', function ($scope, $http, $location,CurrentEmployee,$log) {

  /* <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
      <a href="#" ><span class="fa fa-user"></span>Zeit&nbsp;eintragen</a>
      <a href="#" ><span class="fa fa-user"></span>Mitarbeiter&nbsp;anlegen</a>
      <a href="#" ><span class="fa fa-home"></span>Verwaltung</a> */

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
    $http.put('/api/employees/' + $scope.currentEmployee.id_employee,$scope.currentEmployee)
      .then(function success(response) {
        $scope.allEmployees.splice($scope.allEmployees.indexOf(currentEmployee), 1);
        $scope.allEmployees.push($scope.currentEmployee);
      }, function error(response) {
        console.log("error"+ response.message);
      });
      
  };
  $scope.cancelView = function (){
    $location.path('/');
  };
});

app.controller('informationController', function ($scope,CurrentEmployee,$location) {
  $scope.currentEmployee = CurrentEmployee.getCurrentEmployee();

  $scope.editEmployee = function (){
    $location.path('/editEmployee');
  };
  $scope.cancelView = function (){
     $location.path('/');
   };
});

app.controller('enterWorkdayController', function ($scope,CurrentEmployee,$location,$log) {
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
});

app.controller('CampRegistrationController', function ($scope,CurrentEmployee,$location) {
  $scope.message = 'Look! I am a camp registration controller.';
});

app.factory('CurrentEmployee', function () {

  var currentEmployee = {
    'id_employee': null,
    'forename': null,
    'surname': null,
    'dateofbirth': null,
    'svn': null,
    'uid': null,
    'email': null,
    'phonenumber': null,
    'addressline1': null,
    'addressline2': null,
    'postcode': null,
    'city': null,
    'country': null,
    'bankaccountnumber': null
  };

  return {
      getCurrentEmployee: function () {
          return currentEmployee;
      },
      setCurrentEmployee: function (newCEmp) {
        currentEmployee = newCEmp;
        currentEmployee.svn = parseInt(newCEmp.svn);
        currentEmployee.dateofbirth = new Date(newCEmp.dateofbirth);
      }
  };
});

function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
  document.getElementById("main").style.marginLeft = "300px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "5%";
  document.getElementById("main").style.marginLeft= "5%";
}

$(document).ready(function () {

  $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

});
