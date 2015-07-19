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
    return $http.get(urls.apiUrl + "/books/" + bookId);
  };

  return Book;
});
