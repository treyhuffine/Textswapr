app
.factory('User', function($rootScope, $http, urls) {
  var User = {};
  User.isLoggedIn = false;

  User.getUser = function(username) {
    return $http.get(urls.apiUrl + "/users/" + username);
  };
  User.setCurrentUser = function() {
    User.isLoggedIn = true;
    $rootScope.currentUser = true;
  }
  User.nullCurrentUser = function() {
    User.isLoggedIn = false;
    $rootScope.currentUser = false;
    $rootScope.currentUserData = {};
  }
  User.getCurrentUserData = function() {
    return $http.get(urls.apiUrl + '/currentUserData');
  };

  return User;
});
