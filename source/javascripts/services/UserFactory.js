app
.factory('User', function($http, urls) {
  var User = {};
  User.currentUser = {};

  User.getUser = function(username) {
    return $http.get(urls.apiUrl + "/users/" + username);
  };

  return User;
});
