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
      //      $scope.userBooks.splice(idx,1);
      //
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
      //      $scope.userBooks.splice(idx,1);
    })
    .catch(function(error) {
      console.log(error);
    })
  }
});
