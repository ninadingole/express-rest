var bookController = function (Book) {

    // this will be called to find all the books & search book by genre
    var get = function (req, res) {
        var query = {};

        // filter query if genre is set in the get query params
        if (req.query.genre) {
            query.genre = req.query.genre;
        }

        // find all the books with the given filter parameter of query object, if none then query will be {}
        Book.find(query, function (err, books) {
            if (err) {
                res.status(500)
                res.send(err);
            } else { // if found send the books object back as json.
                var returnBooks = [];
                books.forEach(function (element, index, array) {
                    var newBook = element.toJSON();
                    newBook.links = {};
                    newBook.links.self = 'http://' + req.headers.host + '/api/books/' + newBook._id;
                    returnBooks.push(newBook);
                });
                console.log('returning books');

                res.json(returnBooks);
            }
        });
    };

    // to save a new book to database
    var post = function (req, res) {
        var book = new Book(req.body);
        if (!req.body.title) {
            // validation
            res.status(400);
            res.send('Title is required');
        } else {
            book.save();
            res.status(201);
            res.json(book);
        }
    };

    // middleware function
    var filterBook = function (req, res, next) {
        console.log('inside middleware');
        Book.findById(req.params.id, function (err, book) {
            if (err) {
                res.status(500);
                res.send(err);
            } else if (book) { // if found set the book object in the request and call next
                console.log('book found');
                req.book = book;
                next();
            } else {
                res.status(404);
                res.send('No book found.');
            }
        });
    };

    // find book by id
    var bookById = function (req, res) {
        var newBook = req.book.toJSON();
        newBook.links = {};
        var link = 'http://' + req.headers.host + '/api/books/?genre=' + newBook.genre;

        newBook.links.filterByThisGenre = link.replace(' ', '%20');
        res.json(newBook);
    };

    // update book when all the fields are changed
    var update = function (req, res) {
        req.book.title = req.body.title;
        req.book.author = req.body.author;
        req.book.genre = req.body.genre;
        req.book.read = req.body.read;
        req.book.save(function (err) {
            if (err) {
                res.send(500);
                res.send(err);
            } else {
                res.json(req.book);
            }
        });
    };

    // update the only fields received in the request.
    var patch = function (req, res) {
        if (req.body._id) {
            delete req.body._id;
        }
        for (var p in req.body) {
            req.book[p] = req.body[p];
        }
        req.book.save(function (err) {
            if (err) {
                res.send(500);
                res.send(err);
            } else
                res.json(req.book);
        });
    };
    // remove the book from the database
    var remove = function (req, res) {
        req.book.remove(function (err) {
            if (err) {
                res.status(500);
                res.send(err);
            } else
                res.status(204).send('Removed');
        });
    };
    return {
        post: post,
        get: get,
        filterBook: filterBook,
        bookById: bookById,
        update: update,
        patch: patch,
        remove: remove
    }
};

module.exports = bookController;