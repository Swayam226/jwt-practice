const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const users = [];

// middleware for verification
function verifyUser(req, res, next) {
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const username = decoded.username;
    const user = users.find((user) => user.username === username);
    if (user) {
        req.user = decoded;
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
        }, JWT_SECRET);
        res.json({
            token: token
        });
    } else {
        res.status(403).json({ msg: "declined" })
    }

})

app.get('/me', verifyUser, function (req, res) {
    res.json({
        username: req.decoded,
        message: `welcome ${req.decoded}`
    })
})

app.listen(3000);
