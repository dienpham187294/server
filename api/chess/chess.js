
function getInfo(fs, io) {
    fs.readFile('./database/chessroom.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        io.emit("monopoly", JSON.parse(jsonFile))
    })
}

function create(fs, io, data) {
    fs.readFile('./database/chessroom.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        let arr = updateCreateMonopoly(JSON.parse(jsonFile), data[1], data[2]);
        fs.writeFile('./database/chessroom.txt', JSON.stringify(arr), (err) => {
            if (err) throw err;
        });
        io.emit("updateRoom", arr)
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
    fs.readFile('./database/chessroom.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        let arr = updateJionRoom(JSON.parse(jsonFile), data[1], data[2], data[3]);
        fs.writeFile('./database/chessroom.txt', JSON.stringify(arr), (err) => {
            if (err) throw err;
        });
        io.emit("updateRoom", arr)
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
    fs.readFile('./database/chessroom.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        let arr = updateStart(JSON.parse(jsonFile), data[1], data[2], data[3]);
        fs.writeFile('./database/chessroom.txt', JSON.stringify(arr[0]), (err) => {
            if (err) throw err;
            console.log('Data written to file ========================');
        });
        io.emit("updateRoom", arr[0])
        fs.writeFile(`./database/start/${data[1]}.txt`, JSON.stringify(arr[1]), (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
        arr[2].forEach(e => {
            io.to(e).emit("StartPlay", arr[1])
        })

    })
}


function updateStart(arr, socketid, username, host) {
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
                eee.score = 0;
                eee.level = 1;
            } else {
                eee.score = 0;
                eee.level = 1;
            }
        })
    })
    // CreateGamePlay.push(arrChess)
    arrAll.push(arrRoom);
    arrAll.push(CreateGamePlay);
    arrAll.push(arrSocketid);
    //[1] createGameplay
    return arrAll;
}

function disConnect(fs, io, socketid) {
    fs.readFile('./database/chessroom.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            console.error(err)
            return
        }
        let arr = updateDisconnect(JSON.parse(jsonFile), socketid);
        fs.writeFile('./database/chessroom.txt', JSON.stringify(arr), (err) => {
            if (err) throw err;
            console.log('Data written to file : Disconnect: ');
        });

        io.emit("updateRoom", arr)
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



function monopolyPlayGame(fs, io, data) {
    console.log("monopolyPlayGame", data);
    fs.readFile(`./database/start/${data[1]}.txt`, 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        let arr = (JSON.parse(jsonFile));
        arr[0].members.forEach(e => {
            if (e.username === data[2]) {
                e.x = data[3][0];
                e.y = data[3][1];
            }
        })
        fs.writeFile(`./database/start/${data[1]}.txt`, JSON.stringify(arr), (err) => {
            if (err) throw err;
            console.log('Data written to file Move');
        });
        data[4].forEach(e => {
            io.to(e).emit("updateGamePlay", arr)
        })

    })
};

function UpLevel(fs, io, data) {
    fs.readFile(`./database/start/${data[1]}.txt`, 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        let arr = (JSON.parse(jsonFile));
        arr[0].members.forEach(e => {
            if (e.username === data[2]) {
                e.level += 1;
            }
        })
        fs.writeFile(`./database/start/${data[1]}.txt`, JSON.stringify(arr), (err) => {
            if (err) throw err;
            console.log('Data written to file Move');
        });
        data[3].forEach(e => {
            io.to(e).emit("updateGamePlay", arr)
        })

    })
}
function UpScore(fs, io, data) {
    fs.readFile(`./database/start/${data[1]}.txt`, 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        let arr = (JSON.parse(jsonFile));
        arr[0].members.forEach(e => {
            if (e.username === data[2]) {
                e.score += 1;
            }
        })
        fs.writeFile(`./database/start/${data[1]}.txt`, JSON.stringify(arr), (err) => {
            if (err) throw err;
            console.log('Data written to file Move');
        });
        data[3].forEach(e => {
            io.to(e).emit("updateGamePlay", arr)
        })

    })
}

function LearnNow(io, data) {
    data[2].forEach(e => {
        io.to(e).emit("LearnNow", data[3])
    })
}

function ChangeSocketID(fs, io, data) {
    console.log(data);
    fs.readFile(`./database/start/${data[1]}.txt`, 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        let arr = (JSON.parse(jsonFile));
        arr[0].members.forEach(e => {
            if (e.username === data[2]) {
                e.id = data[3];
                e.status = true;
            }
        })

        fs.writeFile(`./database/start/${data[1]}.txt`, JSON.stringify(arr), (err) => {
            if (err) throw err;
            console.log('Data written to file Move');
        });

        io.to(data[3]).emit("StartPlay", arr)


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
    } else if (data[0] === "monopolyPlayGame") {
        monopolyPlayGame(fs, io, data);
    } else if (data[0] === "UpLevel") {
        // monopolyPlayGame(fs, io, data);
        UpLevel(fs, io, data);
    } else if (data[0] === "UpScore") {
        // monopolyPlayGame(fs, io, data);
        UpScore(fs, io, data);
    } else if (data[0] === "LearnNow") {
        // monopolyPlayGame(fs, io, data);
        LearnNow(io, data);
    } else if (data[0] === "ChangeSocketID") {
        // monopolyPlayGame(fs, io, data);
        ChangeSocketID(fs, io, data);
    }

}
module.exports = { allListen, disConnect }



