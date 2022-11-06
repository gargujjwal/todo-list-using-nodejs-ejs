const express = require("express");
const bodyParser = require("body-parser");

// user-defined module
const date = require(`${__dirname}/scripts/date.js`)

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];
const homeItems = [];

app.get("/", (req, res) => {
    res.render("list", {kindOfDay: date.getDate(), newListItem: items});
});


app.post("/", (req, res) => {
    switch (req.body.list) {
        case "Work":
            workItems.push(req.body.nextToDoListItem);
            res.redirect("/work");
            break;
        case "Home":
            homeItems.push(req.body.nextToDoListItem);
            res.redirect("/home");
            break;
        default:
            items.push(req.body.nextToDoListItem);
            res.redirect("/");
    }
});


app.get("/work", (req, res) => {
    res.render("list", {kindOfDay: "Work", newListItem: workItems});
});


app.get("/home", (req, res) => {
    res.render("list", {kindOfDay: "Home", newListItem: homeItems});
});

app.get("/about", (req, res) => {
    res.render("about");
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

