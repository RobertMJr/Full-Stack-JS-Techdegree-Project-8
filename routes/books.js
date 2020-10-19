const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/**
 * Handle function for wraping each route
 */
function asyncHandler(cb) {
    return async(req, res, next) => {
        try{
            await cb(req, res, next)
        } catch(error){
            next(error);
        }
    }
}

/* GET books - show the full list of books */
router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [["title", "ASC"]]});
    res.render("books/index", {books});
}));

/* GET books/new - show the create new book form */
router.get('/new', (req, res) => {
    res.render("books/new-book", {book: {}, title: "New Book"});
});

module.exports = router;