var app = angular.module('textSwap', ['ui.router']);

app.run(function($rootScope) {
  console.log('Text Swap!');
});

app
.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  // $locationProvider.html5Mode({enabled: true, requireBase: false});

  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('home', {url: '/', templateUrl: '/templates/home.html', controller: 'rootCtrl'})
  .state('showUser', {url: '/users/:username', templateUrl: '/templates/profile.html', controller: 'profileCtrl'})
  .state('addBook', {url: '/books/new', templateUrl: '/templates/addBook.html', controller: 'submitBookCtrl'})
  .state('findBooks', {url: '/books', templateUrl: '/templates/bookIndex.html', controller: 'bookIndexCtrl'});
});

app
.constant('urls',{
  'apiUrl': ''
});

app
.controller("bookIndexCtrl", function($scope, $rootScope, Book, User) {
  $scope.books = [];
  Book.getBooks()
    .success(function(data) {
      $scope.books = data;
    })
    .catch(function(error) {
      console.log(error);
    });
});

app.controller('navCtrl', function($scope, $rootScope, User) {
  $scope.setCurrentUser = function() {
    User.setCurrentUser();
  };
  $scope.nullCurrentUser = function() {
    User.nullCurrentUser();
  }
});

app
.controller("rootCtrl", function($scope, $rootScope, Book, User) {
  $scope.addBook = function(book) {
    Book.addBook(book)
      .success(function(data){
        console.log(data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  $scope.getBooks = function() {
    Book.getBooks()
      .success(function(data) {
        console.log(data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
});

app
.controller("submitBookCtrl", function($scope, $rootScope, $state, Book, User) {
  if (!$rootScope.currentUser) {
    $state.go('home');
  }
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

app
.controller('profileCtrl', function($scope, $rootScope, $state, $stateParams, User, Book) {
  $scope.user = {};
  $scope.userBooks = {};

  User.getUser($stateParams.username)
    .success(function(data) {
      $scope.user = data;
    })
    .catch(function(error) {
      console.log(error);
    });

  Book.getUsersBooks($stateParams.username)
    .success(function(data) {
      $scope.userBooks = data;
    })
    .catch(function(error) {
      console.log(error);
    });
});

app
.factory('Book', function($http, urls) {
  var Book = {};

  Book.addBook = function(book) {
    return $http.post(urls.apiUrl + "/books", book);
  };
  Book.getBooks = function() {
    return $http.get(urls.apiUrl + "/books");
  };
  Book.getUsersBooks = function(username) {
    return $http.get(urls.apiUrl + "/users/" + username + "/books");
  };

  return Book;
});

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
