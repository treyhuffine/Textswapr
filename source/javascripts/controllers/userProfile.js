app
.controller('profileCtrl', function($scope, $state, $stateParams, $http, urls, User) {
  $scope.user = {};
  $http.get(urls.apiUrl + '/users/' + $stateParams.username)
    .success(function(data) {
      console.log(data);
      $scope.user = data;
    })
    .catch(function(error) {
      console.log(error);
    });
});
