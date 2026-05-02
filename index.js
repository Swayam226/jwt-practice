const express = require("express");
// const { use } = require("react");
const crypto = require('crypto');
const app = express();
app.use(express.json());

const users = [];

function generateToken() {
    const token = crypto.randomBytes(32).toString('hex');
    return token;
}

function verifyUser(req, res, next) {
    const token = req.headers.authorization;
    const user = users.find((user) => user.token === token);
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(403).json({ msg: "Access denied" });
    }
}

app.post("/signup", function (req, res) {
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

app.post("/signin", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        user.token = generateToken();
        res.json({ token: user.token });
    } else {
        res.status(403).json({ msg: "wrong invalid username or password" });
    }
})

app.post("/me", verifyUser, function (req, res) {
    res.json({
        username: req.user.username,
        message: `welcome ${req.user.username}`
    });

})

app.listen(3000);