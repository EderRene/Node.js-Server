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
          $scope.deleteEmployee(responseEmp.data);
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

  $scope.deleteFile = function (file) {
    $http({
      method: 'DELETE',
      url: 'api/files/' + file.id_File

    }).then(function (res) {
      $scope.currentEmployee.files.splice($scope.currentEmployee.files.indexOf(file), 1);
    }, function (res) {
      console.log(res);
    });
  }

  $scope.downloadFile = function (file) {
    $http({
      method: 'GET',
      url: 'api/files/' + file.id_File + '/' + file.filename

    }).then(function (res) {
      var linkElement = document.createElement('a');
      try {

        linkElement.setAttribute('href', res.data);
        linkElement.setAttribute('download', file.filename);

        var clickEvent = new MouseEvent("click", {
          "view": window,
          "bubbles": true,
          "cancelable": false
        });

        linkElement.dispatchEvent(clickEvent);

      } catch (ex) {
        console.log(ex);
      }
    }, function (res) {
      console.log(res);
    });
  }
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

//Zeitverwaltungscontroller hier --------------
app.controller('timeManagementController', function ($scope, CurrentEmployee, CurrentWorkday, $location, $http) {
  $scope.allWorkdays = [];
  $scope.currentWeekDate = new Date();
  //$scope.allDaysOfWeek = getWeekFor(new Date());

  $scope.getWorkdays = function () {
    $http.get('/api/workingHours/' + CurrentEmployee.getCurrentEmployee().id_employee)
      .then(function mySuccess(response) {

        $scope.allWorkdays = getWeekFor($scope.currentWeekDate, CurrentEmployee);
        for (var i = 0; i < 7; i++) {
          for (var x = 0; x < response.data.length; x++) {
            response.data[x].workingDate;
            if (new Date($scope.allWorkdays[i].workingDate).getDate() == new Date(response.data[x].workingDate).getDate() && $scope.allWorkdays[i].workingDate.getMonth() == new Date(response.data[x].workingDate).getMonth()) {

              var index = $scope.allWorkdays.indexOf($scope.allWorkdays[i]);

              if (index !== -1) {
                $scope.allWorkdays[index] = response.data[x];
              }
            }
          }
        }
      }, function myError(response) {
        alert('Could not get Workdays:' + response.data);
      });
  };
  $scope.shiftWeek = function (add, dateTime) {
    // this will just increment or decrement the week
    var sunday = moment(dateTime).startOf('week');
    sunday.add(1, 'd');

    if (add) {
      sunday.add(1, 'w');
    } else {
      sunday.subtract(1, 'w');
    }
    $scope.currentWeekDate = sunday.toDate();
    $scope.allWorkdays = $scope.getWorkdays($scope.currentWeekDate); // returns a moment object
  };

  $scope.editWorkday = function (currentWorkday) {
    CurrentWorkday.setCurrentWorkday(currentWorkday);
    $location.path('/enterWorkday');
  };

  $scope.setHoliday = function (currentWorkday) {
    workdayHoliday = {
      'id_Employee': CurrentEmployee.getCurrentEmployee().id_employee,
      'workingDate': currentWorkday.workingDate,
      'isHoliday': true,
      'isSickDay': false,
      'workingHours': {
        'forenoon': {
          'info': "Urlaub",
          'startTime': null,
          'endTime': null
        },
        'afternoon': {
          'info': "Urlaub",
          'startTime': null,
          'endTime': null
        }
      }
    }

    $http.post('/api/workingHours', workdayHoliday)
      .then(function mySuccess(response) {
        $scope.allWorkdays = $scope.getWorkdays();
      }, function myError(response) {
        alert("Fehler: " + response.data);
      });
  };

  $scope.setSickDay = function (currentWorkday) {
    workdaySick = {
      'id_Employee': CurrentEmployee.getCurrentEmployee().id_employee,
      'workingDate': currentWorkday.workingDate,
      'isHoliday': false,
      'isSickDay': true,
      'workingHours': {
        'forenoon': {
          'info': "Krank",
          'startTime': null,
          'endTime': null
        },
        'afternoon': {
          'info': "Krank",
          'startTime': null,
          'endTime': null
        }
      }
    }

    $http.post('/api/workingHours', workdaySick)
      .then(function mySuccess(response) {
        $scope.allWorkdays = $scope.getWorkdays();
      }, function myError(response) {
        alert("Fehler: " + response.data);
      });
  }

  $scope.getWeekFor = function (dateTime) {
    var days = [];
    var sunday = moment(dateTime).startOf('week');

    for (var i = 1; i < 8; i++) {
      days.push(moment(sunday).add(i, 'days').toDate());
    }

    return days; // returns a list of moment objects
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

app.controller('employeeinformationController', function ($scope, CurrentEmployee, $location, $http) {
  $scope.currentEmployee = CurrentEmployee.getCurrentEmployee();

  $scope.deleteFile = function (file) {
    $http({
      method: 'DELETE',
      url: 'api/files/' + file.id_File

    }).then(function (res) {
      $scope.currentEmployee.files.splice($scope.currentEmployee.files.indexOf(file), 1);
    }, function (res) {
      console.log(res);
    });
  }

  $scope.downloadFile = function (file) {
    $http({
      method: 'GET',
      url: 'api/files/' + file.id_File + '/' + file.filename

    }).then(function (res) {
      var linkElement = document.createElement('a');
      try {

        linkElement.setAttribute('href', res.data);
        linkElement.setAttribute('download', file.filename);

        var clickEvent = new MouseEvent("click", {
          "view": window,
          "bubbles": true,
          "cancelable": false
        });

        linkElement.dispatchEvent(clickEvent);

      } catch (ex) {
        console.log(ex);
      }
    }, function (res) {
      console.log(res);
    });
  }
  $scope.editEmployee = function () {
    $location.path('/editEmployee');
  };
  $scope.cancelView = function () {
    $location.path('/');
  };
});

app.controller('newsEmployeeController', function ($scope, CurrentEmployee, $location, $http) {
  $scope.commentArray = [];
  $scope.currentEmployee = CurrentEmployee.getCurrentEmployee();

  $scope.newInfo = {
    'id_Employee': null,
    'dateTime': null,
    'infoHeader': null,
    'info': null
  };

  $scope.getAllNews = function () {
    $http.get('/api/news')
      .then(function (response) {
        $scope.commentArray = response.data;
      }, function (response) {
        console.error(response);
        alert('Could not get all news:' + response.data);
      });
  }


  //Main Object I'm adding all Comment informations
  $scope.addInfo = function () {  // Comment Button click Event

    if ($scope.newInfo.infoHeader != "" && $scope.newInfo.info != "") {

      $scope.newInfo.id_Employee = CurrentEmployee.getCurrentEmployee().id_employee;

      $http.post('/api/news', $scope.newInfo)
        .then(function (response) {
          $scope.getAllNews();  //ist mir alles EGAL xD
        }, function (response) {
          console.error(response);
          alert('Could not post news:' + response.data);
        });
    }
  }

  $scope.removeComment = function (comment) {  // Delete button click Event

    $http.delete('/api/news/' + comment.id_news)
      .then(function (response) {
        $scope.getAllNews();  //ist mir alles EGAL xD
      }, function (response) {
        console.error(response);
        alert('Could not delete news:' + response.data);
      });

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
app.controller('enterWorkdayController', function ($scope, CurrentEmployee, CurrentWorkday, $location, $http) {
  $scope.thistimeFornoon = null;
  $scope.newWorkDay = {
    'id_Employee': CurrentEmployee.getCurrentEmployee().id_employee,
    'workingDate': new Date(),
    'isHoliday': false,
    'isSickDay': false,
    'workingHours': {
      'forenoon': {
        'info': null,
        'startTime': null,
        'endTime': null
      },
      'afternoon': {
        'info': null,
        'startTime': null,
        'endTime': null
      }
    }
  };

  $scope.newWorkDay = CurrentWorkday.getCurrentWorkday();

  $scope.createTimeEntry = function () {
    $http.post('/api/workingHours', $scope.newWorkDay)
      .then(function (response) {
        $location.path('/timeManagement');
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
// "Klasse" für den ausgewählten Workday
app.factory('CurrentWorkday', function () {

  var currentWorkday = {
    'id_Employee': null,
    'workingDate': null,
    'isHoliday': false,
    'isSickDay': false,
    'workingHours': {
      'forenoon': {
        'info': null,
        'startTime': null,
        'endTime': null
      },
      'afternoon': {
        'info': null,
        'startTime': null,
        'endTime': null
      }
    }
  };

  return {
    getCurrentWorkday: function () {
      return currentWorkday;
    },
    setCurrentWorkday: function (newWday) {
      currentWorkday = newWday;
    }
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

function getWeekFor(dateTime, CurrentEmployee) {
  var days = [];
  var emptyWorkingDays = [];
  var sunday = moment(dateTime).startOf('week');

  for (var i = 1; i < 8; i++) {
    days.push(moment(sunday).add(i, 'days').toDate());
  }
  for (var i = 0; i < 7; i++) {
    var newEmptyWorkDay = {
      'id_Employee': 1, //CurrentEmployee.getCurrentEmployee().id_employee
      'workingDate': days[i],
      'isHoliday': false,
      'isSickDay': false,
      'workingHours': {
        'forenoon': {
          'info': null,
          'startTime': null,
          'endTime': null
        },
        'afternoon': {
          'info': null,
          'startTime': null,
          'endTime': null
        }
      }
    };
    emptyWorkingDays.push(newEmptyWorkDay);
  }

  return emptyWorkingDays; // returns a list of moment objects
}

function shiftWeek(add, dateTime) {
  // this will just increment or decrement the week
  var sunday = moment(dateTime).startOf('week');
  sunday.add(1, 'd');

  if (add) {
    sunday.add(1, 'w');
  } else {
    sunday.subtract(1, 'w');
  }

  return getWeekFor(sunday); // returns a moment object
}

function getWeekDate(dateTime) {
  var sunday = moment(dateTime).startOf('week');

  var monday = sunday.add({ day: 1 }).clone();

  return 'Week Commencing ' + monday.format('Do'); // a nicely formatted string of the week commencing
}

function getStartOfWeek(dateTime) {
  var sunday = moment(dateTime).startOf('week');

  var monday = sunday.add({ day: 1 }).clone();

  return monday; // the monday that started the week as a moment object
}
