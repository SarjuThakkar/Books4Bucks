const http = require('http');
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
})

function httpRequest(params, postData) {
    return new Promise(function (resolve, reject) {
        var req = http.request(params, function (res) {
            // reject on bad status
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            // cumulate data
            var body = [];
            res.on('data', function (chunk) {
                body.push(chunk);
            });
            // resolve on end
            res.on('end', function () {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch (e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        // reject on request error
        req.on('error', function (err) {
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });
        if (postData) {
            req.write(postData);
        }
        // IMPORTANT
        req.end();
    });
}


const getBookByISBN = (request, response) => {
    const isbn = parseInt(request.params.isbn)
    pool.query('SELECT * FROM books WHERE isbn = $1', [isbn], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getBookByClass = (request, response) => {
    const coursenum = parseInt(request.params.coursenum)
    const course = request.params.class
    pool.query('SELECT * FROM books WHERE (coursenum = $1 AND class = $2)', [coursenum, course], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getBookByUser = (request, response) => {
    const user = request.params.class
    pool.query('SELECT * FROM books WHERE user = $1', [user], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const postBook = (request, response) => {
    const {
        email,
        isbn,
        coursenum,
        course,
        price
    } = request.body
    const isbnFormatter = 'ISBN:' + isbn
    var params = {
        host: 'openlibrary.org',
        method: 'GET',
        path: '/api/books?bibkeys=' + isbnFormatter + '&jscmd=data&format=json'
    };
    // this is a get, so there's no post data
    httpRequest(params).then(function (body) {
        title = body[isbnFormatter].title
        pool.query('INSERT INTO books (email, isbn, course, coursenum, price, title) VALUES ($1, $2, $3, $4, $5, $6)', [email, isbn, course, coursenum, price, title], (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send(`User added with ID: ${results.insertId}`)
        })
    });
}

const deleteBook = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM books WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Book deleted with ID: ${id}`)
    })
}

module.exports = {
    getBookByISBN,
    getBookByClass,
    getBookByUser,
    postBook,
    deleteBook,
}
