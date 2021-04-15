const server = require('http').createServer();
const io = require('socket.io')(server);
const express = require('express');
const cors = require('cors');
const router = require('./router');
const app = express();
const fs = require('file-system');
const fnAdmin = require("./api/admin/admin");
const fnChess = require("./api/chess/chess");
const fnSaveFile = require("./api/saveFile/saveFile");
const fnLogin = require("./api/login/login");
app.use(cors());
app.use(router);

io.on('connection', client => {
    // console.log("connected : " + client.id);
    //Amin -----------------------------------
    client.on("admin", (data) => {
        fnAdmin.allListen(fs, io, data);
    })
    client.on("chess", (data) => {
        fnChess.allListen(fs, io, data);
    })

    client.on("saveFile", (data) => {
        fnSaveFile.allListen(fs, io, data);
    })
    client.on("Login", (data) => {
        fnLogin.allListen(fs, io, data);
    })
    client.on("JustOneAccount", (data) => {
        io.emit(data[0], data[1])
    })
    //All -----------------------------------
    //Update Disconnect
    client.on('disconnect', () => {
        fnChess.disConnect(fs, io, client.id);
    });
});

server.listen(process.env.PORT || 4444, () => console.log(`Server has started.`));



