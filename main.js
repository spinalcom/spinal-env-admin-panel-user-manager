require("./SpinalUserMnanagerService");
require("./UserManagerCtrl");
(function () {
  angular.module('app.spinal-pannel')
    .run(["$templateCache", "$http", "goldenLayoutService",
      function ($templateCache, $http, goldenLayoutService) {
        let load_template = (uri, name) => {
          $http.get(uri).then((response) => {
            $templateCache.put(name, response.data);
          }, (errorResponse) => {
            console.log('Cannot load the file ' + uri);
          });
        };
        let toload = [{
          uri: '../templates/spinal-env-admin-pannel-user-manager/user-manager-pannel.html',
          name: 'user-manager-pannel.html'
        }, {
          uri: '../templates/spinal-env-admin-pannel-user-manager/user-manager-create-user.html',
          name: 'user-manager-create-user.html'
        }, {
          uri: '../templates/spinal-env-admin-pannel-user-manager/user-manager-edit.html',
          name: 'user-manager-edit.html'
        }];
        for (var i = 0; i < toload.length; i++) {
          load_template(toload[i].uri, toload[i].name);
        }

        goldenLayoutService.registerPannel({
          id: "drag-users-list-pannel",
          name: "Users List",
          cfg: {
            isClosable: true,
            title: "Users List",
            type: 'component',
            width: 20,
            componentName: 'SpinalHome',
            componentState: {
              template: 'user-manager-pannel.html',
              module: 'app.spinal-pannel',
              controller: 'UserManagerCtrl'
            }
          }
        });
      }
    ]);

})();