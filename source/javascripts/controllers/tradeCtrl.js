app.controller('tradeCtrl', function($scope, $rootScope, $state, $stateParams, Book, User) {
  if (!$rootScope.currentUser) {
    $state.go('home');
  }
  $scope.requestedBook = {};
  $scope.currentUserBooks = [];

  Book.getBook($stateParams.bookId)
    .success(function(data) {
      $scope.requestedBook = data;
    })
    .catch(function(error) {
      console.log(error);
    })
  Book.getUsersBooks($rootScope.currentUserData.twitter.username)
    .success(function(data) {
      $scope.currentUserBooks = data;
    })
    .catch(function(error) {
      console.log(error);
    });
  // get desried $stateParams book ID
  // current user books => Book.getUserBooks(current)
});
