app
.controller("rootCtrl", function($scope, $rootScope, Book, User) {
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
