app
  .controller("submitBookCtrl", function($scope, $state, Book) {

  $scope.addBook = function(book) {
    Book.addBook(book)
    .success(function(data){
      $state.go('home');
    })
    .catch(function(error) {
      console.log(error);
    });
  };
});
