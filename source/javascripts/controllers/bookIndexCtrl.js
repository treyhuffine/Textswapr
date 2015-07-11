app
.controller("bookIndexCtrl", function($scope, urls, Book) {
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
