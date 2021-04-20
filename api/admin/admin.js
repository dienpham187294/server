function adminGetInfo(fs, io, data) {
    fs.readFile('./database/user.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        io.to(data[1]).emit("adminInfo", JSON.parse(jsonFile))
    })
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