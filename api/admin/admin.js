function adminGetInfo(fs, io, data) {
    fs.readFile('./database/user.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        io.to(data[1]).emit("adminInfo", JSON.parse(jsonFile))
    })
    fs.readFile('./database/LophocFree.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        io.to(data[1]).emit("adminInfoLichHoc", JSON.parse(jsonFile))
    })
}
function themlophoc(fs, io, data) {
    fs.readFile('./database/LophocFree.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        let arrTemp = JSON.parse(jsonFile);
        arrTemp.push({
            "name": data[1],
            "time": data[2],
            "status": data[3],
            "members": []
        })
        fs.writeFile('./database/LophocFree.txt', JSON.stringify(arrTemp));
        io.to(data[4]).emit("adminInfoLichHoc", arrTemp)


    })

}

function doitrangthai(fs, io, data) {
    if (data[1].length > 1) {
        fs.writeFile('./database/LophocFree.txt', JSON.stringify(data[1]));
        io.to(data[2]).emit("adminInfoLichHoc", data[1])
    }
}
function allListen(fs, io, data) {
    if (data[0] === "get_info") {
        adminGetInfo(fs, io, data)
    }
    if (data[0] === "update_info") {
        if (IsJsonString(data[1]) && data[1].length > 10) {
            fs.writeFile('./database/user.txt', data[1]);
            io.emit("adminInfo", JSON.parse(data[1]))
        } else {
            io.to(data[2]).emit("adminInfoError", "Not a Json File");
        }
    }
    if (data[0] === "themlophoc") {
        themlophoc(fs, io, data)
    }
    if (data[0] === "doitrangthai") {
        doitrangthai(fs, io, data)
    }
}

module.exports = { allListen }


function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}