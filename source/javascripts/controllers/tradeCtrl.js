app.controller('tradeCtrl', function($scope, $rootScope, $state, $stateParams, Book, User) {
  if (!$rootScope.currentUser) {
    $state.go('home');
  }
  $scope.requestedBook = {};
  $scope.currentUserBooks = [];
  $scope.targetedBook = {};
  console.log("stateparams book id: ", $stateParams.bookId);
  Book.getBook($stateParams.bookId)
    .success(function(data) {
      $scope.requestedBook = data;
      console.log("Treys book: ", $scope.requestedBook)
    })
    .catch(function(error) {
      console.log(error);
    })
  console.log($rootScope.currentUserData);
  Book.getUsersBooks($rootScope.currentUserData.twitter.username)
    .success(function(data) {
      $scope.currentUserBooks = data;
    console.log("my books: ", $scope.currentUserBooks)
    })
    .catch(function(error) {
      console.log(error);
    });
  $scope.targetBook = function (book) {
    $scope.targetedBook = book;
  }
  // get desried $stateParams book ID
  // current user books => Book.getUserBooks(current)
});
