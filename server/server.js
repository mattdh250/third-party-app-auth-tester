const path = require('path');
const hbs = require('hbs');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;
const viewsPath = path.join(__dirname, 'views');

var app = express();
app.set('view engine', 'hbs');
app.set('views', viewsPath);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/authtest', (req, res) => {
    res.render('requestauth.hbs');
});

app.post('/requestauth', (req, res) => {

    var url = req.body.Url;
    var clientSecret = req.body.ClientSecret;
    var action = req.body.RequestType;

    var tokenBody = null;
    try {
        tokenBody = JSON.parse(req.body.TokenBody);
    } catch (e) {}

    var redirectURL = `${url}/applications/${action}`;

    // Add Token if not null
    if (tokenBody != null) {
        var token = jwt.sign(tokenBody, clientSecret).toString();
        redirectURL = `${redirectURL}?token=${token}`;
    }

    console.log(redirectURL);
    res.redirect(redirectURL);
});

app.get('/authcallback', (req, res) => {
    var responseToken = req.query.token;
    var jsonObject = null;

    try {
        jsonObject = jwt.decode(responseToken);
    } catch (error) {

    }

    res.render('callback.hbs', {
        responseObject: jsonObject,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});

module.exports = { app };