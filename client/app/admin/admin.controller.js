'use strict';

(function() {

class AdminController {
  constructor(User, ngDialog) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    this.ngDialog = ngDialog
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }

  clickToOpen () {
        this.ngDialog.open({ template: 'templateId' });
    };

  test ()
  {
      alert("AaA");
  }
}

angular.module('chatAppApp.admin')
  .controller('AdminController', AdminController);

})();
