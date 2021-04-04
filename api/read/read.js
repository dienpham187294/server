
function getInfo(fs, io) {
    fs.readFile('./database/readRoom.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        io.emit("read", JSON.parse(jsonFile))
    })
}

function create(fs, io, data) {
    fs.readFile('./database/readRoom.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        let arr = updateCreateMonopoly(JSON.parse(jsonFile), data[1], data[2]);
        fs.writeFile('./database/readRoom.txt', JSON.stringify(arr), (err) => {
            if (err) throw err;
        });
        io.emit("updateRoomRead", arr)
    })
}



function updateCreateMonopoly(arr, socketid, username) {
    let arrRoom = [];
    arr.forEach(ee => {
        if (ee.host === "default") {
            arrRoom.push(ee);
        }
        if (ee.status) {
            if (ee.host !== username) {
                arrRoom.push(ee);
            }
        }
    });
    arrRoom.forEach(eee => {
        eee.members.forEach(mem => {
            if (mem.username === username) { mem.status = false };
        })
    })
    let newRoom = { status: true, id: socketid, host: username, members: [{ status: true, id: socketid, username: username }] };
    arrRoom.push(newRoom);
    return arrRoom;
}

function jion(fs, io, data) {
    fs.readFile('./database/readRoom.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        let arr = updateJionRoom(JSON.parse(jsonFile), data[1], data[2], data[3]);
        fs.writeFile('./database/readRoom.txt', JSON.stringify(arr), (err) => {
            if (err) throw err;
        });
        io.emit("updateRoomRead", arr)
    })
}

function updateJionRoom(arr, socketid, username, hostname) {
    let arrRoom = [];
    arr.forEach(eee => {
        if (eee.host === "default") {
            arrRoom.push(eee)
        }
        else if (eee.host !== username) {
            arrRoom.push(eee)
        }
    })
    arrRoom.forEach(ee => {
        ee.members.forEach(eee => {
            if (eee.username === username) {
                eee.status = false;
            }
        })
    })
    arrRoom.forEach(ee => {
        if (ee.host === hostname) {
            ee.members.push({ status: true, id: socketid, username: username })
        }
    })

    return arrRoom;
}

function updateDisconnect(arr, socketid) {
    let arrRoom = [];
    arr.forEach(eee => {
        arrRoom.push(eee)
    })
    arrRoom.forEach(eee => {
        if (eee.id === socketid) {
            eee.status = false;
        }
        eee.members.forEach(ee => {
            if (ee.id === socketid) {
                ee.status = false;
            }
        })
    })

    return arrRoom;
}
function start(fs, io, data) {

    fs.readFile('./database/readRoom.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        let arr = updateStart(JSON.parse(jsonFile), data[1], data[2], data[3]);
        fs.writeFile('./database/readRoom.txt', JSON.stringify(arr[0]), (err) => {
            if (err) throw err;

        });
        io.emit("updateRoomRead", arr[0])
        fs.writeFile(`./database/start/${arr[1][0].id}.txt`, JSON.stringify(arr[1]), (err) => {
            if (err) throw err;

        });
        arr[2].forEach(e => {
            io.to(e).emit("StartPlayRead", arr[1])
        })

    })
}


function updateStart(arr, host) {
    let arrAll = []; //Contain [0] updateRoom [1] createStartGame
    //[0] updateRoom
    let arrRoom = [];
    let CreateGamePlay = [];
    let arrSocketid = [];
    arr.forEach(eee => {
        arrRoom.push(eee)
    })

    arrRoom.forEach(eee => {
        if (eee.host === host) {
            eee.status = false;
            CreateGamePlay.push(eee);
            eee.members.forEach(eeee => {
                if (eeee.status) { arrSocketid.push(eeee.id) }
            })
        }
    })
    CreateGamePlay.forEach(ee => {
        ee.members.forEach(eee => {
            if (eee.username === host) {
                eee.point = 0;
            } else {
                eee.point = 0;
            }
        })
    })
    arrAll.push(arrRoom);
    arrAll.push(CreateGamePlay);
    arrAll.push(arrSocketid);
    //[1] createGameplay
    return arrAll;
}

function disConnect(fs, io, socketid) {
    fs.readFile('./database/readRoom.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            console.error(err)
            return
        }
        let arr = updateDisconnect(JSON.parse(jsonFile), socketid);
        fs.writeFile('./database/readRoom.txt', JSON.stringify(arr), (err) => {
            if (err) throw err;

        });

        io.emit("updateRoomRead", arr)
    })
}
function updateDisconnect(arr, socketio) {
    let arrTemp = [];
    arr.forEach(e => {
        arrTemp.push(e);
    });
    arrTemp.forEach(e => {
        if (e.id === socketio) {
            e.status = false;
        }
        e.members.forEach(ee => {
            if (ee.id === socketio) {
                ee.status = false;
            }
        })
    })
    return arrTemp;
}

function FileRead(fs, io, data) {
    fs.readFile('./database/readFile/readFile.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            console.error(err)
            return
        }
        let arr = JSON.parse(jsonFile)

        data[1].forEach(e => {
            io.to(e).emit("ReadFile", arr)
        })


    })
}
function StartToRead(fs, io, data) {
    data[1].forEach(e => {
        io.to(e).emit("StartToRead", data[2])
    })
}

function UpdatePoint(fs, io, data) {

    fs.readFile(`./database/start/${data[1]}.txt`, 'utf8', (err, jsonFile) => {
        if (err) {
            console.error(err)
            return
        }
        let arr = JSON.parse(jsonFile)
        arr[0].members.forEach(e => {
            if (e.username === data[2]) {
                e.point += 1;
            }
        })
        fs.writeFile(`./database/start/${data[1]}.txt`, JSON.stringify(arr), (err) => {
            if (err) throw err;
        });

        data[3].forEach(e => {
            io.to(e).emit("updateGamePlayRead", arr)
        })
    })
}

function allListen(fs, io, data) {
    if (data[0] === "get_info") {
        getInfo(fs, io);
    }
    //Monopoly 2-----------------------------------
    else if (data[0] === "createRoom") {
        create(fs, io, data);
    }
    //Monopoly 3----------------------------------- 
    else if (data[0] === "jionRoom") {
        jion(fs, io, data);
    }
    //Monopoly 4-----------------------------------
    else if (data[0] === "start") {
        start(fs, io, data);
    } else if (data[0] === "ReadFile") {
        FileRead(fs, io, data)
    } else if (data[0] === "startToRead") {
        StartToRead(fs, io, data)
    } else if (data[0] === "UpdatePoint") {
        UpdatePoint(fs, io, data)
    }

}
module.exports = { allListen, disConnect }