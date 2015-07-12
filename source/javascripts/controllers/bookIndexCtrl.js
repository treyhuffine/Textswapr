app
.controller("bookIndexCtrl", function($scope, Book) {
  console.log("book index");
  $scope.books = [];
  Book.getBooks()
    .success(function(data) {
      $scope.books = data;
      console.log($scope.books);
    })
    .catch(function(error) {
      console.log(error);
    });
});
