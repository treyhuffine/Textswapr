var app = angular.module('textSwap', ['ui.router']);

app.run(function($rootScope) {
  console.log('Text Swap!');
  $rootScope.currentUser = false;
  $rootScope.currentUserData = {};
});

app
.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  // $locationProvider.html5Mode({enabled: true, requireBase: false});

  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('home', {url: '/', templateUrl: '/templates/home.html', controller: 'rootCtrl'})
  .state('showUser', {url: '/users/:username', templateUrl: '/templates/profile.html', controller: 'profileCtrl'})
  .state('addBook', {url: '/books/new', templateUrl: '/templates/addBook.html', controller: 'submitBookCtrl'})
  .state('findBooks', {url: '/books', templateUrl: '/templates/bookIndex.html', controller: 'bookIndexCtrl'})
  .state('initiateTrade', {url: '/trades/:bookId', templateUrl: '/templates/trade.html', controller: 'tradeCtrl'});
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
      console.log($scope.books);
    })
    .catch(function(error) {
      console.log(error);
    });
  $scope.checkId = function(book) {
    console.log("book", book);
  }
});

app.controller('navCtrl', function($scope, $rootScope, User, $http, urls) {
  $scope.setCurrentUser = function() {
    User.setCurrentUser();
  };
  $scope.nullCurrentUser = function() {
    User.nullCurrentUser();
  }
  User.getCurrentUserData()
    .success(function(data) {
      $rootScope.currentUserData = data;
    })
    .catch(function(error) {
      console.log(error);
    });
});

app
.controller('profileCtrl', function($scope, $rootScope, $state, $stateParams, User, Book) {
  $scope.user = {};
  $scope.userBooks = [];

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
  $scope.deleteBook = function(book, idx) {
    Book.deleteBook(book)
    .success(function(data) {
      console.log("book deleted");
      $scope.userBooks.splice(idx,1);
    })
    .catch(function(error) {
      console.log(error);
    });
  }
});

app
.controller("rootCtrl", function($scope, $rootScope, Book, User) {

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

app.controller('tradeCtrl', function($scope, $rootScope, $state, $stateParams, Book, User) {
  if (!$rootScope.currentUser) {
    $state.go('home');
  }
  $scope.requestedBook = {};
  $scope.currentUserBooks = [];
  $scope.targetedBook = {};
  console.log("stateparams book id: ", $stateParams.bookId);
  Book.getBook($stateParams.bookId)
    .success(function(data) {
      $scope.requestedBook = data;
      console.log("Treys book: ", $scope.requestedBook)
    })
    .catch(function(error) {
      console.log(error);
    })
  console.log($rootScope.currentUserData);
  Book.getUsersBooks($rootScope.currentUserData.twitter.username)
    .success(function(data) {
      $scope.currentUserBooks = data;
    console.log("my books: ", $scope.currentUserBooks)
    })
    .catch(function(error) {
      console.log(error);
    });
  $scope.targetBook = function (book) {
    $scope.targetedBook = book;
  }
  // get desried $stateParams book ID
  // current user books => Book.getUserBooks(current)
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
  Book.deleteBook = function(removedBook) {
    return $http.delete(urls.apiUrl + "/books/" + removedBook._id);
  };
  Book.getBook = function(bookId) {
    console.log("bookId: ", bookId);
    return $http.get(urls.apiUrl + "/books/" + bookId);
  };

  return Book;
});

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
