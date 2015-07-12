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
