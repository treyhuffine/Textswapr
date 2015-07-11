app
  .controller("submitBookCtrl", function($scope, $state, urls, Book) {
  console.log("IN BOOK CTRL");
  $scope.addBook = function(book) {
    Book.addBook(book)
    .success(function(data){
      console.log(data);
      $state.go('home');
    })
    .catch(function(error) {
      console.log(error);
    });
  };
});
