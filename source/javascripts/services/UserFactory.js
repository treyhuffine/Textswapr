app
.factory('User', function($rootScope, $http, urls) {
  var User = {};
  User.currentUser = false;

  User.getUser = function(username) {
    return $http.get(urls.apiUrl + "/users/" + username);
  };
  User.setCurrentUser = function() {
    User.currentUser = true;
    $rootScope.currentUser = true;
  }
  User.nullCurrentUser = function() {
    User.currentUser = false;
    $rootScope.currentUser = false;
  }
  User.getCurrentUserData = function() {
    return $http.get('/currentUserData');
  };

  return User;
});
