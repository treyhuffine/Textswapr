app
.controller("mainCtrl", function($scope, Book, User) {
  console.log("IN CTRL");

  $scope.addBook = function(book) {
    Book.addBook(book)
      .success(function(data){
        console.log(data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  $scope.getBooks = function() {
    Book.getBooks()
      .success(function(data) {
        console.log(data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
});
