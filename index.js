const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
 // socket io runs on http server for that we have to import http and we have to create http server
const app = express();
const server = http.createServer(app);// it will create a server
const io = socketio(server); // calling socketio function on my server
const port = 3000;

// Middleware
app.set("view engine" , "ejs");
app.set('views' , path.resolve("./views"));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));

io.on("connection", function(socket){
    socket.on("send-location", function (data){
        io.emit("recieve-location" , {id: socket.id, ...data});
    });

    socket.on("disconnect" , function(){
        io.emit("user-disconnected" , socket.id);
    })
    console.log("connected")
})
// Routes
app.get('/', function(req, res) {
  res.render("index")
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
server.listen(port, () => {
  console.log(`server is hosted http://localhost:${port}`);
});