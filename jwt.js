const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
app.use(express.json());

const users = [];

// middleware for verification
function verifyUser(req, res, next) {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const username = decoded.username;
    // const user = users.find((user) => user.username === username);
    if (decoded.username) {
        req.username = decoded.username;
        next();
    } else {
        res.status(403).json({ msg: "denied" })
    }
}

app.post('/signup', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (users.find(user => user.username === username)) {
        res.json({ msg: "you are already signed in" });
        return;
    }
    const user = {
        username: username,
        password: password
    }
    users.push(user);
    res.json({ msg: "you are signed up" })
})

app.post('/signin', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const user = users.find((user) => user.username === username && user.password === password);

    if (user) {
        const token = jwt.sign({
            username: username
        }, process.env.JWT_SECRET);
        res.json({
            token: token
        });
    } else {
        res.status(403).json({ msg: "declined" })
    }

})

app.get('/me', verifyUser, function (req, res) {
    res.json({
        username: req.username,
        message: `welcome ${req.username}`
    })
})

app.listen(3000);
