app
.controller("mainCtrl", function($scope, $http, urls) {
  console.log("IN CTRL");

  $scope.addBook = function(book) {
    $http.post(urls.apiUrl + "/books", book)
    .success(function(data){
      console.log(data);
    }).catch(function(error) {
      console.log(error);
    })
  }
});
