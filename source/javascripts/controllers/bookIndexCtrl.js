app
.controller("bookIndexCtrl", function($scope, Book, User) {
  $scope.books = [];
  Book.getBooks()
    .success(function(data) {
      $scope.books = data;
    })
    .catch(function(error) {
      console.log(error);
    });
});
