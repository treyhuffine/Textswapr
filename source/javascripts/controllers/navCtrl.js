app.controller('navCtrl', function($scope, $rootScope, User, $http, urls) {
  $scope.setCurrentUser = function() {
    User.setCurrentUser();
  };
  $scope.nullCurrentUser = function() {
    User.nullCurrentUser();
  }
  User.getCurrentUserData()
    .success(function(data) {
      $rootScope.currentuserData = data;
    })
    .catch(function(error) {
      console.log(error);
    });
});
