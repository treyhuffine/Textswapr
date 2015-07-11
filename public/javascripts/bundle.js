var app = angular.module('textSwap', ['ui.router']);

app.run(function() {
  console.log('Text Swap!');
});

app
.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  $locationProvider.html5Mode({enabled: true, requireBase: false});

  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('home', {url: '/', templateUrl: '/templates/home.html'});
  // .state('search', {
  //   url: '/q/:query',
  //   templateUrl: '/templates/home/search.html',
  //   controller: 'searchCtrl'
  // });

});

app
.constant('urls',{
  'apiUrl': ''
});

app
.controller("mainCtrl", function($scope) {
  console.log("IN CTRL");
});
