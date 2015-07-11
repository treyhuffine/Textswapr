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
