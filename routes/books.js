const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const db = require('../models')
const { Op } = db.Sequelize;

/**
 * Handle function for wraping routes
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
    let books;
    const resultsPerPage = 5;
    if (req.query.search) {
        let {count, rows} = await Book.findAndCountAll({
            where:{
                [Op.or]:{
                    title:{
                        [Op.like]: '%' + req.query.search + '%'
                    },
                    author: {
                        [Op.like]: '%' + req.query.search + '%'
                    },
                    genre: {
                        [Op.like]: '%' + req.query.search + '%'
                    },
                    year: {
                        [Op.like]: '%' + req.query.search + '%'
                    },
                }
            },
            order: [["title", "ASC"]]
            
        })
        books = rows;
        const pages = Array(Math.ceil(count/resultsPerPage));
        res.render("books/index", {books, pages});
        
    } else {
        let {count, rows} = await Book.findAndCountAll({ 
            order: [["title", "ASC"]],
            
        });

        books = rows;
        const pages = Array(Math.ceil(count/resultsPerPage));
        res.render("books/index", {books, pages});
    }
}));

/* GET books/new - show the create new book form */
router.get('/new', (req, res) => {
    res.render("books/new-book", {book: {}, title: "New Book"});
});

/* POST books/new - create a new book */
router.post("/", asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect("books");
    } catch(error) {
        if(error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            res.render("books/new-book", {book, errors: error.errors, title:"New Book"})
        }
    }
}));

/* GET books/:id - show book detail form */
router.get('/:id', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book){
        console.log(book.id);
        res.render("books/update-book", {book, title: "Update Book" });
    } else {
        const err = new Error();
        err.status = 404;
        throw err;
    }
}));

/* POST books/:id - update book info */
router.post('/:id', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        if(book) {
            await book.update(req.body); // Pass the data from the form to the db via the req.body
            res.redirect("/books");
        } else {
            const err = new Error();
            err.status = 404;
            throw err;
        }
    } catch(error) {
        if(error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            book.id = req.params.id; // Ensure the correct book is being modified
            res.render("books/update-book", {book, errors: error.errors, title: "Update Book"});
        } else {
            throw error;
        }
    }  
}));

/* POST books/:id/delete - deletes a book */
router.post('/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
        await book.destroy();
        res.redirect("/books");
    } else {
        const err = new Error();
        err.status = 404;
        throw err;
    }
}));


module.exports = router;