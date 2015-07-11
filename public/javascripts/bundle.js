var app = angular.module('textSwap', ['ui.router']);

app.run(function() {
  console.log('Text Swap!');
});

app
.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  // $locationProvider.html5Mode({enabled: true, requireBase: false});

  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('home', {url: '/', templateUrl: '/templates/home.html'})
  // .state('search', {
  //   url: '/q/:query',
  //   templateUrl: '/templates/home/search.html',
  //   controller: 'searchCtrl'
  // });
  .state('addBook', {url: '/items/new', templateUrl: '/templates/addBook.html', controller: 'submitBookCtrl'})
  .state('findBooks', {url: '/items', templateUrl: '/templates/bookIndex.html', controller: 'bookIndexCtrl'});

});

app
.constant('urls',{
  'apiUrl': ''
});

app
.controller("bookIndexCtrl", function($scope, $http, urls, Book) {
  console.log("book index");
  $scope.books = [];
  Book.getBooks()
    .success(function(data) {
      $scope.books = data;
      console.log($scope.books);
    })
    .catch(function(error) {
      console.log(error);
    });
});

app
.controller("mainCtrl", function($scope, $http, urls, Book) {
  console.log("IN CTRL");

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
  .controller("submitBookCtrl", function($scope, $http, urls, Book) {
  console.log("IN BOOK CTRL");
  $scope.addBook = function(book) {
    Book.addBook(book)
      .success(function(data){
      console.log(data);
    })
      .catch(function(error) {
      console.log(error);
    });
  };
});

app
.factory('Book', function($http, urls) {
  var Book = {};

  Book.addBook = function(book) {
    return $http.post(urls.apiUrl + "/books", book);
  };
  Book.getBooks = function() {
    return $http.get(urls.apiUrl + "/books")
  }

  return Book;
});
