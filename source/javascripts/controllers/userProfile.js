app
.controller('profileCtrl', function($scope, $state, $stateParams, User, Book) {
  $scope.user = {};
  $scope.userBooks = {};

  User.getUser($stateParams.username)
    .success(function(data) {
      $scope.user = data;
    })
    .catch(function(error) {
      console.log(error);
    });

  Book.getUsersBooks($stateParams.username)
    .success(function(data) {
      $scope.userBooks = data;
    })
    .catch(function(error) {
      console.log(error);
    });
});
