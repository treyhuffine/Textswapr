app
.controller("bookIndexCtrl", function($scope, Book, User) {
  $scope.books = [];
  console.log(User.currentUser);
  Book.getBooks()
    .success(function(data) {
      $scope.books = data;
    })
    .catch(function(error) {
      console.log(error);
    });
});
