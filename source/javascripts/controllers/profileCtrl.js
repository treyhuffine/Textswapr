app
.controller('profileCtrl', function($scope, $rootScope, $state, $stateParams, User, Book, Trade) {
  $scope.user = {};
  $scope.userBooks = [];
  $scope.$apply();

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
  $rootScope.$watch('currentUserData', function(newVal, oldVal) {
    if ($stateParams.username.toLowerCase() === $rootScope.currentUserData.twitter.username.toLowerCase()) {
        Trade.getInitiatedTrades($rootScope.currentUserData.twitter.username)
          .success(function(data) {
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
  })
  $scope.deleteBook = function(book, idx) {
    Book.deleteBook(book)
    .success(function(data) {
      $scope.userBooks.splice(idx,1);
    })
    .catch(function(error) {
      console.log(error);
    });
  }
  $scope.deleteTrade = function(trade, idx, tradeType) {
    Trade.removeTrade(trade)
      .success(function(data) {
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
      swal('Congratulations!', 'Your trade was successful', 'success');
      $state.go($state.$current, null, { reload: true });
    })
    .catch(function(error) {
      console.log(error);
      swal('Trade failed!')
    })
  }
});
