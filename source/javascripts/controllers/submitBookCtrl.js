app
.controller("submitBookCtrl", function($scope, $rootScope, $state, Book, User) {
  if ($rootScope.currentUser) {
    $state.go('home');
  }
  $scope.addBook = function(book) {
    Book.addBook(book)
    .success(function(data){
      $state.go('home');
    })
    .catch(function(error) {
      console.log(error);
    });
  };
});
