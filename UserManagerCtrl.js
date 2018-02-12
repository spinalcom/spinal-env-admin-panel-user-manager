(function () {

  angular.module('app.spinal-pannel')
    .controller('UserManagerCtrl', ["$scope", "$injector", "authService", "$mdToast", "$interval", "$timeout", "spinalModelDictionary", "$mdDialog",
      function ($scope, $injector, authService, $mdToast, $interval, $timeout, spinalModelDictionary, $mdDialog) {
        $scope.injector = $injector;
        $scope.users = [];
        $scope.mainMenuClick = (btn) => {

          btn.action(btn);
        };

        spinalModelDictionary.init().then(function () {
          // $scope.users = ;
          // console.log($scope.users);
          spinalModelDictionary.users.bind(onUsersChange);
        });

        function onUsersChange() {
          $scope.merge_users(spinalModelDictionary.users.get(), $scope.users);
        }



        // {
        //   username: "",
        //   type: 0,
        //   id: 0,
        // }

        $scope.getUserTypeString = (person) => {
          return "";
          // switch (person.type) {
          //   case 0:
          //     return "0";
          //   case 1:
          //     return "1";
          //   case 2:
          //     return "2";
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
                type: origin[i].type || 0,
                id: origin[i].id,
                selected: false,
              };
              dest.splice(i, 0, u);
            } else {
              dest[idx].name = origin[i].name;
              dest[idx].type = origin[i].type || 0;
              dest[idx].id = origin[i].id;
            }
          }
          $scope.$apply();
        };
        $scope.onUserTypeChange = (person) => {
          console.log("onUserTypeChange");
          console.log(person);
        };

        $scope.deleteSelected = () => {
          console.log("deleteSelected");
        };
        $scope.addUser = () => {
          console.log("addUser");
        };
        $scope.editUser = (user) => {
          console.log("editUser");
          console.log(user);

          $mdDialog.show({
            ariaLabel: 'EditUser',
            template: templateCache.get("user-manager-edit.html"),
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            controller: ["$scope", "$mdDialog", "user", EditUserCtrl],
            locals: {
              user: user,
              spinalModelDictionary: spinalModelDictionary,
            }
          })
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

  var EditUserCtrl = function ($scope, $mdDialog, user) {

    $scope.userEdit = user;
    $scope.password_generator = (len) => {
      var length = (len) ? (len) : (10);
      var string = "abcdefghijklmnopqrstuvwxyz"; //to upper 
      var numeric = '0123456789';
      var punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
      var password = "";
      var character = "";
      var crunch = true;
      while (password.length < length) {
        entity1 = Math.ceil(string.length * Math.random() * Math.random());
        entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
        entity3 = Math.ceil(punctuation.length * Math.random() * Math.random());
        hold = string.charAt(entity1);
        hold = (entity1 % 2 == 0) ? (hold.toUpperCase()) : (hold);
        character += hold;
        character += numeric.charAt(entity2);
        character += punctuation.charAt(entity3);
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

  };

  var NewUserCtrl = function ($scope, $mdDialog) {

    $scope.password_generator = (len) => {
      var length = (len) ? (len) : (10);
      var string = "abcdefghijklmnopqrstuvwxyz"; //to upper 
      var numeric = '0123456789';
      var punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
      var password = "";
      var character = "";
      var crunch = true;
      while (password.length < length) {
        entity1 = Math.ceil(string.length * Math.random() * Math.random());
        entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
        entity3 = Math.ceil(punctuation.length * Math.random() * Math.random());
        hold = string.charAt(entity1);
        hold = (entity1 % 2 == 0) ? (hold.toUpperCase()) : (hold);
        character += hold;
        character += numeric.charAt(entity2);
        character += punctuation.charAt(entity3);
        password = character;
      }
      return password;
    };
    $scope.newuser = {
      name: "",
      password: "",
      confirm_password
    };
    $scope.newUserCancel = () => {
      console.log("newUserCancel");
      $mdDialog.hide();
    };
    // Set the default value of inputType
    $scope.passwordInputType = 'password';

    $scope.showPassword = function () {
      $scope.passwordInputType = 'text';
    };
    $scope.hidePassword = function () {
      $scope.passwordInputType = 'password';
    };

    $scope.newUserOK = (usr) => {
      console.log(newUserOK);
      console.log(usr);
      $mdDialog.hide();
    };
  };

})()