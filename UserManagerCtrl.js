angular.module('app.spinal-pannel')
  .controller('UserManagerCtrl', ["$scope", "$injector", "authService", "$mdToast", "$interval", "$timeout", "spinalModelDictionary",
    function ($scope, $injector, authService, $mdToast, $interval, $timeout, spinalModelDictionary) {
      $scope.injector = $injector;
      $scope.users = [];


      $scope.mainMenuBtn = [{
          label: "addUsers",
          action: $scope.addUser,
          icon: "person_add"
        },
        {
          label: "deleteSelectedUsers",
          action: $scope.deleteSelected,
          icon: "delete"
        },
        {
          label: "clearSelect",
          action: $scope.clearSelect,
          icon: "block"
        },
      ];

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
        switch (person.type) {
          case 0:
            return "0";
          case 1:
            return "1";
          case 2:
            return "2";
          default:
            return "undef";

        }
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

    }
  ]);
