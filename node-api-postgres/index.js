const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/buy', function (req, res) {
    res.render('pages/buy');
});

app.get('/sell', function (req, res) {
    res.render('pages/sell');
});

app.get('/sign', function (req, res) {
    res.render('pages/sign');
});

app.get('/delete', function (req, res) {
    res.render('pages/delete');
});

app.get('/edit', function (req, res) {
    res.render('pages/edit');
});

app.get('/getstarted', function (req, res) {
    res.render('pages/getstarted');
});


app.get('/books/:isbn', db.getBookByISBN)
app.get('/books/:class', db.getBookByClass)
app.get('/books/:user', db.getBookByUser)
app.post('/books', db.postBook)
app.delete('/books/:id', db.deleteBook)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
