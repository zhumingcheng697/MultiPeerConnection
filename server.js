// Express is a node module for building HTTP servers
const express = require("express");
const app = express();

// Tell Express to look in the "public" folder for any files first
app.use(express.static("public"));

// If the user just goes to the "route" / then run this function
app.get("/", function (req, res) {
    res.send("Hello World!");
});

const port = process.env.PORT || 8080;

// Here is the actual HTTP server
const http = require("http");

// We pass in the Express object and the options object
const httpServer = http.createServer(app);

// Default HTTPS port
httpServer.listen(port);

/*
 This server simply keeps track of the peers all in one big "room"
 and relays signal messages back and forth.
 */

const peers = () => io.of("/").adapter.sids.keys();

// WebSocket Portion
// WebSockets work with the HTTP server
const { Server } = require("socket.io");
const io = new Server(httpServer, {
    cors: {
        origin: true,
        methods: ["GET", "POST"]
    }
});

console.log(`Server started on port ${ port }`);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on("connection",

    // We are given a websocket object in our function
    function (socket) {
        console.log(`Peer ${ socket.id } joined`);

        socket.on("list", function () {
            socket.emit("list-results", [...peers()]);
        });

        // Relay signals back and forth
        socket.on("signal", (to, from, data) => {
            io.to(to).emit("signal", to, from, data)
        });

        socket.on("disconnect", function () {
            console.log(`Peer ${ socket.id } left`);
            io.emit("peer_disconnect", socket.id);
        });
    }
);
