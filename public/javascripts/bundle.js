var app = angular.module('textSwap', ['ui.router']);

app.run(function($rootScope) {
  console.log('Text Swap!');
  // $rootScope.currentUser = false;
  // $rootScope.currentUserData = {};
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
    })
    .catch(function(error) {
      console.log(error);
    });
  console.log($rootScope.currentUserData);
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
.controller('profileCtrl', function($scope, $rootScope, $state, $stateParams, User, Book, Trade) {
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
  if ($stateParams.username.toLowerCase() === $rootScope.currentUserData.twitter.username.toLowerCase()) {
      Trade.getInitiatedTrades($rootScope.currentUserData.twitter.username)
        .success(function(data) {
          console.log(data);
          $scope.sentTrades = data;
        })
        .catch(function(error) {
          console.log(error);
        });
  }
  if ($stateParams.username.toLowerCase() === $rootScope.currentUserData.twitter.username.toLowerCase()) {
    Trade.getRequestedTrades($rootScope.currentUserData.twitter.username)
      .success(function(data) {
        console.log(data);
        $scope.receivedTrades = data;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
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
  $scope.deleteTrade = function(trade, idx, tradeType) {
    console.log(tradeType);
    Trade.removeTrade(trade)
      .success(function(data) {
      console.log("book deleted: ", data);
      if (tradeType === 'received') {
        $scope.receivedTrades.splice(idx, 1);
      }
      else {
        $scope.sentTrades.splice(idx, 1);
      }
    })
      .catch(function(error) {
      console.log(error);
    })
  }
  $scope.acceptTrade = function(trade) {
    Trade.acceptTrade(trade)
      .success(function(data) {
      console.log("bookChanged: ", data);
      swal('Congratulations!', 'Your trade was successful', 'success');
      $state.go($state.$current, null, { reload: true });
    })
    .catch(function(error) {
      console.log(error);
      swal('Trade failed!')
    })
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

app.controller('tradeCtrl', function($scope, $rootScope, $state, $stateParams, Book, User, Trade) {
  if (!$rootScope.currentUser || !$rootScope.currentUserData) {
    $state.go('home');
  }
  $scope.requestedBook = {};
  $scope.currentUserBooks = [];
  $scope.showBookList = true;

  Book.getBook($stateParams.bookId)
    .success(function(data) {
      $scope.requestedBook = data;
    })
    .catch(function(error) {
      console.log(error);
    })
  Book.getUsersBooks($rootScope.currentUserData.twitter.username)
    .success(function(data) {
      $scope.currentUserBooks = data;
    })
    .catch(function(error) {
      console.log(error);
    });
  $scope.targetBook = function (book) {
    $scope.targetedBook = book;
    $scope.showBookList = false;
  }
  $scope.untargetBook = function (book) {
    $scope.targetedBook = {};
    $scope.showBookList = true;
  }
  $scope.createTrade = function() {
    console.log("Starting trade");
    if (!$scope.showBookList) {
      $scope.tradeData = {
        tradeInitiatorUsername: $rootScope.currentUserData.twitter.username,
        tradeInitiatorDisplayName: $rootScope.currentUserData.twitter.displayName,
        tradeInitiatorID: $rootScope.currentUserData._id,
        tradeReceiverUsername: $scope.requestedBook.ownerUsername,
        tradeReceiverDisplayName: $scope.requestedBook.ownerDisplayName,
        tradeReceiverID: $scope.requestedBook.ownerId,
        initiatorBookID: $scope.targetedBook._id,
        initiatorBookTitle: $scope.targetedBook.title,
        receiverBookID: $scope.requestedBook._id,
        receiverBookTitle: $scope.requestedBook.title
      };
      console.log('data', $scope.tradeData);
      console.log($rootScope.currentUserData);
      console.log($scope.requestedBook);
      Trade.createTrade($scope.tradeData)
      .success(function(data) {
        console.log(data)
        console.log($rootScope.currentUserData.twitter.username);
        $state.go('showUser', {username: $rootScope.currentUserData.twitter.username});
      })
      .catch(function(error) {
        console.log(error);
      })
    }
  };
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
.factory('Trade', function($rootScope, $http, urls) {
  var Trade = {};

  Trade.createTrade = function(tradeData) {
    return $http.post(urls.apiUrl + '/trades', tradeData);
  };
  Trade.getInitiatedTrades = function(activeUser) {
    return $http.get(urls.apiUrl + '/trades/initiated/' + activeUser)
  }
  Trade.getRequestedTrades = function(activeUser) {
    return $http.get(urls.apiUrl + '/trades/requested/' + activeUser)
  }
  Trade.removeTrade = function(deniedTrade) {
    console.log(deniedTrade._id);
    return $http.patch(urls.apiUrl + '/trades/remove/' + deniedTrade._id)
  }
  Trade.acceptTrade = function(acceptedTrade) {
    console.log(acceptedTrade._id);
    return $http.patch(urls.apiUrl + '/trades/accept/' + acceptedTrade._id)
  }

  return Trade;
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
