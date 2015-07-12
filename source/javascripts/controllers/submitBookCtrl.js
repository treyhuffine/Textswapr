app
.controller("submitBookCtrl", function($scope, $state, Book, User) {
  if (!User.currentUser) {
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
