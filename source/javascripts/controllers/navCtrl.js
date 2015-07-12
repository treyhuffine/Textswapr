app.controller('navCtrl', function($scope, User) {
  $scope.setCurrentUser = function() {
    User.setCurrentUser();
  };
  $scope.nullCurrentUser = function() {
    User.nullCurrentUser();
  }
});
