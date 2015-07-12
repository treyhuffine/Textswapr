app
.controller("bookIndexCtrl", function($scope, Book) {
  $scope.books = [];
  Book.getBooks()
    .success(function(data) {
      $scope.books = data;
    })
    .catch(function(error) {
      console.log(error);
    });
});
