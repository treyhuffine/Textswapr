app
.controller("bookIndexCtrl", function($scope, $rootScope, Book, User) {
  $scope.books = [];
  Book.getBooks()
    .success(function(data) {
      $scope.books = data;
      console.log($scope.books);
    })
    .catch(function(error) {
      console.log(error);
    });
  $scope.checkId = function(book) {
    console.log("book", book);
  }
});
