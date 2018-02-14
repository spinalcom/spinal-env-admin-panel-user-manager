angular.module('app.spinal-pannel')
  .factory("SpinalUserMnanagerService", [function () {
    let factory = {};
    let options;
    let admin = {
      id: 0,
      password: ""
    };

    factory.setAdminAccoount = (admin_id, password) => {

    };

    factory.get_user_id = (user_name, password) => {

    };
    factory.get_admin_id = (admin_name, password) => {

    };
    factory.new_account = (user_name, password) => {

    };
    factory.change_password = (user_id, password, new_password) => {

    };
    factory.delete_account = (user_id, password) => {

    };
    factory.change_password_by_admin = (username, password) => {

    };
    factory.delete_account_by_admin = (username) => {

    };
    factory.change_account_rights_by_admin = (username, right) => {

    };



    // var password, user;

    // user = document.getElementById("input_user").value;

    // password = document.getElementById("input_password").value;

    // if (user === "" || password === "") {
    //   return false;
    // }

    // SpinalUserManager.new_account("http://" + config.host + ":" + config.port + "/", user, password, function(response) {
    //   return $.gritter.add({
    //     title: 'Notification',
    //     text: 'Success create new account.'
    //   });
    // }, function(err) {
    //   $.gritter.add({
    //     title: 'Notification',
    //     text: 'Error create new account.'
    //   });
    //   return console.log("Error create new account");
    // });







    return factory;
  }]);