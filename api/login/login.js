
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
            "phone": data[6],
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
function DangkyLichHocInfo(fs, io, data) {
    fs.readFile('./database/LophocFree.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        io.to(data[1]).emit("DangkyLichHocInfo", JSON.parse(jsonFile));
    })
}
function DangKyLopHoc_Pickclass(fs, io, data) {
    fs.readFile('./database/LophocFree.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        let arrTemp = JSON.parse(jsonFile);
        arrTemp.forEach(e => {
            if (e.members.length !== 0) {
                e.members.forEach(e => {
                    if (e.name === data[2]) {
                        e.status = false;
                    }
                })
            }
        });
        arrTemp.forEach(e => {
            if (e.name === data[1]) {
                e.members.push({ "name": data[2], "status": true })
            }

        });


        if (JSON.stringify(arrTemp).length > 10) {
            fs.writeFile('./database/LophocFree.txt', JSON.stringify(arrTemp), (err) => {
                if (err) throw err;
            });
        }
        io.to(data[3]).emit("DangKyLopHoc_Pickclass", arrTemp);
        // // // io.to(data[3]).emit("DangkyLichHocInfo", arrTemp);
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
    if (data[0] === "DangkyLichHocInfo") {
        DangkyLichHocInfo(fs, io, data);
    }
    if (data[0] === "DangKyLopHoc_Pickclass") {
        DangKyLopHoc_Pickclass(fs, io, data);
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