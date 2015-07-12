app.controller('navCtrl', function($scope, User) {
  $scope.loggedInUser = false;
  $scope.setCurrentUser = function(user) {
    $scope.loggedInUser = true;
  };
  $scope.nullCurrentUser = function() {
    $scope.loggedInUser = false;
  }
});
