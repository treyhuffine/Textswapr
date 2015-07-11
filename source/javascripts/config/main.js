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
  //
  .state('showUser', {url: '/users/:username', templateUrl: '/template/profile.html', controller: 'profileCtrl'})
  .state('addBook', {url: '/items/new', templateUrl: '/templates/addBook.html', controller: 'submitBookCtrl'})
  .state('findBooks', {url: '/items', templateUrl: '/templates/bookIndex.html', controller: 'bookIndexCtrl'});

});

app
.constant('urls',{
  'apiUrl': ''
});
