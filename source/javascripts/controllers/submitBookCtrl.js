app
  .controller("submitBookCtrl", function($scope, $http, urls, Book) {
  console.log("IN BOOK CTRL");
  $scope.addBook = function(book) {
    Book.addBook(book)
      .success(function(data){
      console.log(data);
    })
      .catch(function(error) {
      console.log(error);
    });
  };
});
