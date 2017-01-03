var express = require('express'),
    mongoose = require('mongoose');

var router = function (Book) {
    // create new bookR
    var bookRouter = express.Router();
    var bookController = require('../controllers/bookController.js')(Book);
    // map all urls /api/books/** to this route
    bookRouter.route('/').post(bookController.post).get(bookController.get);

    // middleware to call before any get,put method is called
    bookRouter.use('/:id', bookController.filterBook);

    // all HTTP verbs support
    bookRouter.route('/:id').get(bookController.bookById).put(bookController.update).patch(bookController.patch).delete(bookController.remove);

    return bookRouter;
};

module.exports = router;