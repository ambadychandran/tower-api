const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require('passport');

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

//use passport middleware
app.use(passport.initialize());

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


// route to application welcome page
app.get("/", (req, res) => {
  res.json({ message: "Welcome to towers api" });
});

require("./app/routes/towers.routes")(app,io);
require("./app/routes/users.routes")(app);

io.on('connection', () =>{
  console.log('socket user connected')
})

// set port, listen for requests
const PORT = process.env.PORT || 5000;

var server = http.listen(PORT, () => {
  console.log('server is running on port', server.address().port);
});