(function () {
  compareTo.$inject = [];

  function compareTo() {

    return {
      require: "ngModel",
      scope: {
        compareTolValue: "=compareTo"
      },
      link: function (scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function (modelValue) {

          return modelValue == scope.compareTolValue;
        };

        scope.$watch("compareTolValue", function () {
          ngModel.$validate();
        });
      }
    };
  }

  angular.module('app.spinal-pannel')
    .directive('compareTo', compareTo)
    .provider('$copyToClipboard', [function () {

      this.$get = ['$q', '$window', function ($q, $window) {
        var body = angular.element($window.document.body);
        var textarea = angular.element('<textarea/>');
        textarea.css({
          position: 'fixed',
          opacity: '0'
        });
        return {
          copy: function (stringToCopy) {
            var deferred = $q.defer();
            deferred.notify("copying the text to clipboard");
            textarea.val(stringToCopy);
            body.append(textarea);
            textarea[0].select();

            try {
              var successful = $window.document.execCommand('copy');
              if (!successful) throw successful;
              deferred.resolve(successful);
            } catch (err) {
              deferred.reject(err);
              //window.prompt("Copy to clipboard: Ctrl+C, Enter", toCopy);
            } finally {
              textarea.remove();
            }
            return deferred.promise;
          }
        };
      }];
    }])

    .controller('UserManagerCtrl', ["$scope", "$injector", "authService", "$mdToast", "$interval", "$timeout", "spinalModelDictionary", "$mdDialog", "$templateCache",
      function ($scope, $injector, authService, $mdToast, $interval, $timeout, spinalModelDictionary, $mdDialog, $templateCache) {
        $scope.injector = $injector;
        $scope.users = [];
        $scope.mainMenuClick = (btn) => {
          btn.action(btn);
        };

        spinalModelDictionary.init().then(function () {
          spinalModelDictionary.users.bind(onUsersChange);
        });

        function onUsersChange() {
          $scope.merge_users(spinalModelDictionary.users.get(), $scope.users);
        }


        $scope.getUserTypeString = (person) => {
          return "";
          // switch (person.type) {
          //   case 0:
          //     return "Admin";
          //   case 1:
          //     return "User";
          //   case 2:
          //     return "Suspended";
          //   default:
          //     return "undef";
          // }
        };

        function findUserId(arr, id) {
          return arr.findIndex((obj) => {
            return obj.id === id;
          });
        }

        $scope.merge_users = (origin, dest) => {
          var i;
          for (i = 0; i < dest.length; i++) {
            let idx = findUserId(origin, dest[i].id);
            if (idx === -1) {
              dest.splice(i, 1);
              --i;
            }
          }
          for (i = 0; i < origin.length; i++) {
            let idx = findUserId(dest, origin[i].id);
            if (idx === -1) {
              var u = {
                name: origin[i].name,
                type: origin[i].type || 1,
                id: origin[i].id,
                selected: false,
              };
              dest.splice(i, 0, u);
            } else {
              dest[idx].name = origin[i].name;
              dest[idx].type = origin[i].type || 1;
              dest[idx].id = origin[i].id;
            }
          }
          $scope.$apply();
        };
        $scope.onUserTypeChange = (person) => {
          console.log("onUserTypeChange");
          console.log(person);
        };

        $scope.addUser = () => {
          console.log("addUser");
          $mdDialog.show({
            ariaLabel: 'NewUser',
            template: $templateCache.get("user-manager-create-user.html"),
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: true,
            controller: ["$scope", "$mdDialog", "$copyToClipboard", "$mdToast", "$window", NewUserCtrl],
            locals: {
              spinalModelDictionary: spinalModelDictionary,
            }
          })
        };



        $scope.editUser = (user) => {
          console.log("editUser");
          console.log(user);

          $mdDialog.show({
            ariaLabel: 'EditUser',
            template: $templateCache.get("user-manager-edit.html"),
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: true,
            controller: ["$scope", "$mdDialog", "$copyToClipboard", "$mdToast", "$window", "user", EditUserCtrl],
            locals: {
              user: user,
              spinalModelDictionary: spinalModelDictionary,
            }
          });
        };

        $scope.getUserIcon = (user) => {
          if (user.selected === true)
            return "done";
          return "person";
        };
        $scope.clickUserIcon = (user) => {
          console.log("clickUserIcon");
          user.selected = !user.selected;
        };
        $scope.selectedStyle = (user) => {
          if (user && user.selected)
            return 'background-color: #4185f4';
          return '';
        };
        $scope.clearSelect = () => {
          for (var i = 0; i < $scope.users.length; i++) {
            $scope.users[i].selected = false;
          }
        };
        $scope.haveSelectedUsers = () => {
          for (var i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i].selected === true)
              return true;
          }
          return false;
        }
        $scope.showMainBtn = (btn) => {
          if (btn.show_only_if_selected === true) {
            if ($scope.haveSelectedUsers())
              return true;
            return false;
          }
          return true;
        };
        $scope.deleteSelected = () => {
          console.log("deleteSelected");
        };

        $scope.mainMenuBtn = [{
            label: "addUsers",
            action: $scope.addUser,
            icon: "person_add",
            show_only_if_selected: false
          },
          {
            label: "deleteSelectedUsers",
            action: $scope.deleteSelected,
            icon: "delete",
            show_only_if_selected: true
          },
          {
            label: "clearSelect",
            action: $scope.clearSelect,
            icon: "block",
            show_only_if_selected: true
          },
        ];

      }
    ]);

  var EditUserCtrl = function ($scope, $mdDialog, $copyToClipboard, $mdToast, $window, user) {

    $scope.userEdit = user;
    $scope.change_password = {
      password: "",
      confirm_password: ""
    }
    $scope.password_generator = (len) => {
      var length = (len) ? (len) : (10);
      var string = "abcdefghijklmnopqrstuvwxyz";
      var numeric = '0123456789';
      var password = "";
      var character = "";
      var crunch = true;
      while (password.length < length) {
        if (Math.floor(Math.random() * 2)) {
          let entity1 = Math.ceil(string.length * Math.random() * Math.random());
          let hold = string.charAt(entity1);
          hold = (entity1 % 2 == 0) ? (hold.toUpperCase()) : (hold);
          character += hold;
        } else {
          let entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
          character += numeric.charAt(entity2);
        }
        password = character;
      }
      return password;
    };
    // Set the default value of inputType
    $scope.passwordInputType = 'password';

    $scope.showPassword = function () {
      $scope.passwordInputType = 'text';
    };
    $scope.hidePassword = function () {
      $scope.passwordInputType = 'password';
    };


    $scope.changeType = (userType) => {
      console.log(userType);
    };

    $scope.sendMail = function (emailId, subject, message) {
      let myWindow = window.open('', '');
      myWindow.document.location = "mailto:" + emailId + "?subject=" + subject + "&body=" + message;
      myWindow.focus();
    };


    $scope.changePasswordSubmit = (newpasswordForm, change_password, mailto) => {
      newpasswordForm.$setDirty();
      if (newpasswordForm.$valid) {
        if (mailto) {
          $scope.sendMail(user.name, "Your SpinalBIM password has been reset",
            "Hello%2C%0A%0AYour%20admin%20have%20requested%20to%20reset%20your%20password%2C%0A%0AThe%20new%20password%20is%20the%20following%20%3A%0A%0A%0A" +
            encodeURI(change_password.password));
        }
        return;
      }
    };
    $scope.changePasswordGenerate = (change_password) => {
      change_password.password = $scope.password_generator();
      change_password.confirm_password = change_password.password;
      $mdToast.showSimple("Password generated.");
    };


    var toast_clipboard_error = $mdToast.simple()
      .textContent("Error: couldn't copy the password to clipboard")
      .action("Open native prompt")
      .capsule(true)
      .highlightClass("md-warn");
    $scope.changePasswordCopyToClipboard = (change_password) => {
      if (change_password && change_password.password) {
        $copyToClipboard.copy(change_password.password).then(function () {
          $mdToast.showSimple("Password copied to clipboard.");
        }, function () {
          console.log("copy error");
          $mdToast.show(toast_clipboard_error).then(function (res) {
            if (res === 'ok')
              window.prompt("Copy to clipboard: Ctrl+C", change_password.password);
          }, function () {});

        });
      } else {
        console.log("copy error");
      }
    };


  };

  var NewUserCtrl = function ($scope, $mdDialog, $copyToClipboard, $mdToast, $window) {

    $scope.password_generator = (len) => {
      var length = (len) ? (len) : (10);
      var string = "abcdefghijklmnopqrstuvwxyz";
      var numeric = '0123456789';
      var password = "";
      var character = "";
      var crunch = true;
      while (password.length < length) {
        if (Math.floor(Math.random() * 2)) {
          let entity1 = Math.ceil(string.length * Math.random() * Math.random());
          let hold = string.charAt(entity1);
          hold = (entity1 % 2 == 0) ? (hold.toUpperCase()) : (hold);
          character += hold;
        } else {
          let entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
          character += numeric.charAt(entity2);
        }
        password = character;
      }
      return password;
    };
    $scope.doSendMail = false;
    $scope.user = {
      name: "",
      password: "",
      confirm_password: "",
      type: "1"
    };
    $scope.newUserCancel = () => {
      console.log("newUserCancel");
      $mdDialog.cancel();
    };
    // Set the default value of inputType
    $scope.passwordInputType = 'password';

    $scope.showPassword = function () {
      $scope.passwordInputType = 'text';
    };
    $scope.hidePassword = function () {
      $scope.passwordInputType = 'password';
    };

    $scope.sendMail = function (emailId, subject, message) {
      let myWindow = window.open('', '');
      myWindow.document.location = "mailto:" + emailId + "?subject=" + subject + "&body=" + message;
      myWindow.focus();
    };

    $scope.newUserOK = (usrForm, usr, doSendMail) => {
      usrForm.$setDirty();
      if (usrForm.$valid) {
        if (usr.password === usr.confirm_password) {
          if (doSendMail)
            $scope.sendMail(usr.name, "Your SpinalBIM account has been created",
              "Hello%2C%0A%0AYour%20admin%20have%20created%20your%20SpinalBIM%20account.%0A%0ALogin%09%3A%09" +
              encodeURI(usr.name) + "%0APassword%09%3A%09" + encodeURI(usr.password) +
              "%0A%0A%0APlease%20change%20your%20account%20password%20when%20logged%20in.");
          $mdDialog.hide(usr);
          return;
        }
      }
    };

    $scope.passwordGenerate = (change_password) => {
      change_password.password = $scope.password_generator();
      change_password.confirm_password = change_password.password;
      $mdToast.showSimple("Password generated.");
    };

    var toast_clipboard_error = $mdToast.simple()
      .textContent("Error: couldn't copy the password to clipboard")
      .action("Open native prompt")
      .capsule(true)
      .highlightClass("md-warn");
    $scope.copyToClipboard = (password) => {
      if (password) {
        $copyToClipboard.copy(password).then(function () {
          $mdToast.showSimple("Password copied to clipboard.");
        }, function () {
          console.log("copy error");
          $mdToast.show(toast_clipboard_error).then(function (res) {
            if (res === 'ok')
              window.prompt("Copy to clipboard: Ctrl+C", password);
          }, function () {});

        });
      } else {
        console.log("copy error");
      }
    };

  };

})();