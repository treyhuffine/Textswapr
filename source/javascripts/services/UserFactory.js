app
.factory('User', function($http, urls) {
  var User = {};
  User.currentUser = false;

  User.getUser = function(username) {
    return $http.get(urls.apiUrl + "/users/" + username);
  };
  User.setCurrentUser = function() {
    User.currentUser = true;
  }
  User.nullCurrentUser = function() {
    User.currentUser = false;
  }

  return User;
});
