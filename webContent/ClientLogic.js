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
      controller: 'employeeinformationController'
    })
    .when('/editEmployee', {
      templateUrl: 'webpages/EmployeeEditPage.html',
      controller: 'editEmployeeController'
    })
    .when('/enterWorkday', {
      templateUrl: 'webpages/enterWorkday.html',
      controller: 'enterWorkdayController'
    })
    .when('/addCamp', {
      templateUrl: 'webpages/CampRegistrationPage.html',
      controller: 'campRegistrationController'
    })
    .when('/editCamp', {
      templateUrl: 'webpages/CampEditPage.html',
      controller: 'editCampController'
    })
    .when('/showCamp', {
      templateUrl: 'webpages/CampInformationPage.html',
      controller: 'campInformationController'
    })
    .when('/newsEmployee', {
      templateUrl: 'webpages/EmployeeNewsPage.html',
      controller: 'newsEmployeeController'
    })
    .when('/timeManagement', {
      templateUrl: 'webpages/TimeManagement.html',
      controller: 'timeManagementController'
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

  $scope.showCamp = function (camp) {
    CurrentCamp.setCurrentCamp(camp);
    $location.path('/showCamp');
  };
  $scope.editCamp = function (camp) {
    CurrentCamp.setCurrentCamp(camp);
    $location.path('/editCamp');
  };
});

app.controller('registrationController', function ($scope, CurrentEmployee, $location) {
  $scope.message = 'Look! I am a page.';
});

app.controller('campRegistrationController', function ($scope, $http, $location, CurrentCamp) {
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
      .then(function success(response) {
        $scope.cancelView();
        // $scope.newCamp.id_Camp = response.data.id_Camp;
        //$scope.allCamps.push($scope.newCamp);
      }, function error(response) {
        console.error(response);
        alert('Could not register camp:' + response.data);
      });
  }
  $scope.cancelView = function () {
    $location.path('/campVerwaltung');
  };
});

app.controller('myCtrl', function ($scope, $http, $location, CurrentEmployee) {

  /* <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
      <a href="#" ><span class="fa fa-user"></span>Zeit&nbsp;eintragen</a>
      <a href="#" ><span class="fa fa-user"></span>Mitarbeiter&nbsp;anlegen</a>
      <a href="#" ><span class="fa fa-home"></span>Verwaltung</a> */

  // $http.defaults.headers.get.Authorization = "Basic " + localStorage.getItem("google-token");

  $scope.employeeSelected = function (employee) {
    CurrentEmployee.setCurrentEmployee(employee);

    $scope.alerts = [
      { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
      { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];

    $scope.addAlert = function () {
      $scope.alerts.push({ msg: 'Another alert!' });
    };

    $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
    };
  };

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
    'country': null,
    'files': null
  };

  $scope.deselectFileFromEmployee = function (file) {
    $scope.newEmployee.files.splice($scope.newEmployee.files.indexOf(file), 1);
  }

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
      .then(function (responseEmp) {

        var fd = new FormData();

        // for (file in $scope.newEmployee.files) {
        //   fd.append('file', file);
        // }

        for (var i in $scope.newEmployee.files) {
          fd.append("fileToUpload", $scope.newEmployee.files[i]);
        }

        $http.post('/api/files/' + responseEmp.data.id_Employee, fd, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        }).then(function (responseFiles) {
          $location.path('/');
        }, function (responseFiles) {
          deleteEmployee(responseEmp.data);
          console.error(responseFiles);
        })
      }, function (responseEmp) {
        console.error(responseEmp);
        alert('Could not register user:' + responseEmp.data);
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

app.directive('ngFileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var model = $parse(attrs.ngFileModel);
      var isMultiple = attrs.multiple;
      var modelSetter = model.assign;
      element.bind('change', function () {
        var values = [];

        modelSetter(scope, element[0].files[0]);

        angular.forEach(element[0].files, function (file) {
          values.push(file);
        });

        scope.$apply(function () {
          if (isMultiple) {
            modelSetter(scope, values);
          } else {
            modelSetter(scope, values[0]);
          }
        });
      });
    }
  };
}]);

app.controller('editCampController', function ($scope, CurrentCamp, $location, $http) {
  $scope.currentCamp = CurrentCamp.getCurrentCamp();

  $scope.updateCamp = function () {
    $http.put('/api/camps/' + $scope.currentCamp.id_camp, $scope.currentCamp)
      .then(function success(response) {
        $scope.cancelView();
        //  $scope.allEmployees.splice($scope.allEmployees.indexOf(currentEmployee), 1);
        //  $scope.allEmployees.push($scope.currentEmployee);
      }, function error(response) {
        console.log("error" + response.message);
      });

  };
  $scope.cancelView = function () {
    $location.path('/campVerwaltung');
  };
});

app.controller('editEmployeeController', function ($scope, CurrentEmployee, $location, $http) {
  $scope.currentEmployee = CurrentEmployee.getCurrentEmployee();

  $scope.updateEmployee = function () {
    $http.put('/api/employees/' + $scope.currentEmployee.id_employee, $scope.currentEmployee)
      .then(function success(response) {
        $scope.cancelView();
        //  $scope.allEmployees.splice($scope.allEmployees.indexOf(currentEmployee), 1);
        //  $scope.allEmployees.push($scope.currentEmployee);
      }, function error(response) {
        console.log("error" + response.message);
      });

  };
  $scope.cancelView = function () {
    $location.path('/');
  };
});
app.controller('timeManagementController', function ($scope, CurrentEmployee, $location, $http) {
  $scope.allWorkdays = [];

  $scope.getWorkdays = function () {
    $http.get('/api/workingHours/' + CurrentEmployee.getCurrentEmployee().id_employee)
      .then(function mySuccess(response) {
        $scope.allWorkdays = response.data;
      }, function myError(response) {
        alert('Could not get Workdays:' + response.data);
      });
  };
});


app.controller('campInformationController', function ($scope, CurrentCamp, $location) {
  $scope.currentCamp = CurrentCamp.getCurrentCamp();

  $scope.editCamp = function () {
    $location.path('/editCamp');
  };
  $scope.cancelView = function () {
    $location.path('/campVerwaltung');
  };
});

app.controller('employeeinformationController', function ($scope, CurrentEmployee, $location) {
  $scope.currentEmployee = CurrentEmployee.getCurrentEmployee();

  $scope.editEmployee = function () {
    $location.path('/editEmployee');
  };
  $scope.cancelView = function () {
    $location.path('/');
  };
});

app.controller('newsEmployeeController', function ($scope, CurrentEmployee, $location) {
  $scope.commentArray = [];
  $scope.currentEmployee = CurrentEmployee.getCurrentEmployee();

  //Main Object I'm adding all Comment informations
  $scope.addComment = function () {  // Comment Button click Event
    if ($scope.CommentText != null) {

      var newInfo = {
        'id_Employee': CurrentEmployee.getCurrentEmployee().id_employee,
        'dateTime': null,
        'infoHeader': null,
        'info': null
      };

      newInfo.dateTime = new Date();
      newInfo.info = $scope.CommentText;
      newInfo.infoHeader = $scope.infoHeader;

      $scope.commentArray.push(newInfo);
      $scope.CommentText = "";
      $scope.infoHeader = "";

    }
  }
  $scope.removeComment = function ($comText) {  // Delete button click Event
    $scope.commentArray.splice($comText, 1);
  }

  $scope.editEmployee = function () {
    $location.path('/editEmployee');
  };
  $scope.cancelView = function () {
    $location.path('/');
  };
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("openModalNews");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal 
  btn.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});
//Controller für Zeit eintragen
app.controller('enterWorkdayController', function ($scope, CurrentEmployee, $location, $http) {
  $scope.thistimeFornoon = null;
  $scope.newWorkDay = {
    'id_Employee': CurrentEmployee.getCurrentEmployee().id_employee,
    'workingDate': new Date(),
    'workingHours': {
      'forenoon': {
        'startTime': null,
        'endTime': null
      },
      'afternoon': {
        'startTime': null,
        'endTime': null
      }
    }
  };

  $scope.createTimeEntry = function () {
    $http.post('/api/workingHours', $scope.newWorkDay)
      .then(function (response) {
        // $scope.timeTable.push($scope.newWorkDay);
      }, function (response) {
        console.error(response);
        alert('Could not register user:' + response.data);
      });
  }

  $scope.clear = function () {
    $scope.newWorkDay.workingHours.forenoon = null;
    $scope.newWorkDay.workingHours.afternoon = null;
  };
});
// "Klasse" für den ausgewählten Employee
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
    'bankaccountnumber': null,
    'files': null
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
    'addressline1': null,
    'addressline2': null,
    'postcode': null,
    'city': null,
    'country': null,
    'id_leader': null,
    'forname': null,
    'surname': null
  };

  return {
    getCurrentCamp: function () {
      return currentCamp;
    },
    setCurrentCamp: function (newCCamp) {
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
