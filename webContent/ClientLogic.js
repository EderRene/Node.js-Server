var app = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap']);


app.config(function ($routeProvider) {
  $routeProvider

    // route for the Userverwaltung page
    .when('/', {
      templateUrl: 'webpages/Mitarbeiterverwaltung.html',
      controller: 'myCtrl'
    })
    .when('/campVerwaltung', {
      templateUrl: 'webpages/Campverwaltung.html',
      controller: 'campController'
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
    .when('/enterWorkday', {
      templateUrl: 'webpages/enterWorkday.html',
      controller: 'enterWorkdayController'
    })
    .when('/addCamp', {
      templateUrl: 'webpages/CampRegistrationPage.html',
      controller: 'campRegistrationController'
    });
});



app.controller('campController', function ($scope, $http, $location, CurrentCamp) {

  /* <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
      <a href="#" ><span class="fa fa-user"></span>Zeit&nbsp;eintragen</a>
      <a href="#" ><span class="fa fa-user"></span>Mitarbeiter&nbsp;anlegen</a>
      <a href="#" ><span class="fa fa-home"></span>Verwaltung</a> */

  // $http.defaults.headers.get.Authorization = "Basic " + localStorage.getItem("google-token");


  $scope.allCamps = [];

  $scope.getCamps = function () {
    $http.get('/api/camps')
      .then(function mySuccess(response) {
        $scope.allCamps = response.data;
      }, function myError(response) {
        alert('Could not get camps:' + response.data);
      });
  };

  $scope.deleteCamp = function (camp) {
    $http.delete('/api/camps/' + camp.id_camp)
      .then(function success(response) {

        $scope.allCamps.splice($scope.allCamps.indexOf(camp), 1);

      }, function error(response) {
        console.log("error");
      });
  };
});

app.controller('registrationController', function ($scope, CurrentEmployee, $location) {
  $scope.message = 'Look! I am a page.';
});

app.controller('campRegistrationController', function ($scope, $http, $location, CurrentCamp) {

  /* <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
      <a href="#" ><span class="fa fa-user"></span>Zeit&nbsp;eintragen</a>
      <a href="#" ><span class="fa fa-user"></span>Mitarbeiter&nbsp;anlegen</a>
      <a href="#" ><span class="fa fa-home"></span>Verwaltung</a> */

  // $http.defaults.headers.get.Authorization = "Basic " + localStorage.getItem("google-token");


  $scope.allCamps = [];

  $scope.newCamp = {
    'id_Camp': null,
    'name': null,
    'addressLine1': null,
    'addressLine2': null,
    'postCode': null,
    'city': null,
    'country': null,
    'id_Leader': null
  };


  $scope.createCamp = function () {
    $http.post('/api/camps', $scope.newCamp)
      .then(function (response) {
        $scope.newCamp.id_Camp = response.data.id_Camp;
        $scope.allCamps.push($scope.newCamp);
      }, function (response) {
        console.error(response);
        alert('Could not register camp:' + response.data);
      });
  }


  $scope.editCamp = function (camp) {
    CurrentCamp.setCurrentEmployee(employee);
    $location.path('/editCamp');
  };
});

app.controller('myCtrl', function ($scope, $http, $location, CurrentEmployee) {

  /* <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
      <a href="#" ><span class="fa fa-user"></span>Zeit&nbsp;eintragen</a>
      <a href="#" ><span class="fa fa-user"></span>Mitarbeiter&nbsp;anlegen</a>
      <a href="#" ><span class="fa fa-home"></span>Verwaltung</a> */

  // $http.defaults.headers.get.Authorization = "Basic " + localStorage.getItem("google-token");



  $scope.toggleVerwaltung = function () {

    if ($location.path() == "/") {

      $location.path('/campVerwaltung');

    } else {
      $location.path('/');
    }
  };

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

app.controller('editController', function ($scope, CurrentEmployee, $location, $http) {
  $scope.currentEmployee = CurrentEmployee.getCurrentEmployee();

  $scope.updateEmployee = function () {
    $http.put('/api/employees/' + $scope.currentEmployee.id_employee, $scope.currentEmployee)
      .then(function success(response) {
        $scope.allEmployees.splice($scope.allEmployees.indexOf(currentEmployee), 1);
        $scope.allEmployees.push($scope.currentEmployee);
      }, function error(response) {
        console.log("error" + response.message);
      });

  };
  $scope.cancelView = function () {
    $location.path('/');
  };
});

app.controller('informationController', function ($scope, CurrentEmployee, $location) {
  $scope.currentEmployee = CurrentEmployee.getCurrentEmployee();

  $scope.editEmployee = function () {
    $location.path('/editEmployee');
  };
  $scope.cancelView = function () {
    $location.path('/');
  };
});

app.controller('enterWorkdayController', function ($scope, CurrentEmployee, $location) {
  $scope.message = 'Look! I am a page.';
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


app.factory('CurrentCamp', function () {

  var currentCamp = {
    'id_Camp': null,
    'name': null,
    'addressLine1': null,
    'addressLine2': null,
    'postCode': null,
    'city': null,
    'country': null,
    'id_Leader': null
  };

  return {
    getCurrentCamp: function () {
      return currentCamp;
    },
    setCurrentEmployee: function (newCCamp) {
      currentCamp = newCCamp;
    }
  };
});

function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
  document.getElementById("main").style.marginLeft = "300px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "5%";
  document.getElementById("main").style.marginLeft = "5%";
}

$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
  });
});

function searchTableMitarbeiter() {
  var value = $("#filterMitarbeiter").val().toLowerCase();
  $("#searchableMitarbeiter tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
}

function searchTableCamp() {
  var value = $("#filterCamp").val().toLowerCase();
  $("#searchableCamp tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
}
