
function getInfo(fs, io, data) {
    fs.readFile(`./database/record/${data[1]}.txt`, 'utf8', (err, jsonFile) => {
        if (err) {
            // console.error(err)
            return
        }
        io.to(data[2]).emit("get_info_One", jsonFile)

    })
};

function getinfodangkytaikhoan(fs, io, data) {
    fs.readFile('./database/user.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        io.to(data[1]).emit("getinfodangkytaikhoan", JSON.parse(jsonFile))
    })
}
function dangkytaikhoan(fs, io, data) {
    fs.readFile('./database/user.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        let arrOfUser = JSON.parse(jsonFile);
        arrOfUser.push({
            "username": data[1],
            "password": data[4],
            "name": data[2],
            "position": "student",
            "ipaddress": data[5],
            "email": data[3],
            "time": Date.now() + 5 * 24 * 60 * 60 * 1000,
            "status": "Trial5ngay"
        })
        if (JSON.stringify(arrOfUser).length > 10) {
            fs.writeFile('./database/user.txt', JSON.stringify(arrOfUser), (err) => {
                if (err) throw err;
            });
        }
    })
}
function allListen(fs, io, data) {
    if (data[0] === "get_info_One") {
        getInfo(fs, io, data);
    }
    if (data[0] === "dangkytaikhoan") {
        getinfodangkytaikhoan(fs, io, data);
    }
    if (data[0] === "DangkyInfoSubmit") {
        dangkytaikhoan(fs, io, data);
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