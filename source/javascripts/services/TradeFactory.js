app
.factory('Trade', function($rootScope, $http, urls) {
  var Trade = {};

  Trade.createTrade = function(tradeData) {
    return $http.post(urls.apiUrl + '/trades', tradeData);
  };

  return Trade;
});
