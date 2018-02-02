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
        }];
        for (var i = 0; i < toload.length; i++) {
          load_template(toload[i].uri, toload[i].name);
        }

        goldenLayoutService.registerPannel({
          id: "drag-log-pannel",
          name: "Log",
          cfg: {
            isClosable: true,
            title: "Log",
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