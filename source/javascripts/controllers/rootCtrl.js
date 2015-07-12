app
.controller("rootCtrl", function($scope, $rootScope, Book, User) {
  console.log($rootScope.currentUserData);
  // $scope.getBooks = function() {
  //   Book.getBooks()
  //     .success(function(data) {
  //       console.log(data);
  //     })
  //     .catch(function(error) {
  //       console.log(error);
  //     });
  // };
});
