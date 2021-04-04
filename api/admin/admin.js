function adminGetInfo(fs, io) {
    fs.readFile('./database/user.txt', 'utf8', (err, jsonFile) => {
        if (err) {
            return
        }
        io.emit("admin", JSON.parse(jsonFile))
    })
}
function allListen(fs, io, data) {
    if (data[0] === "get_info") {
        adminGetInfo(fs, io)
    } else {
        fs.writeFile('./database/user.txt', data[1]);
        // console.log(JSON.parse(data[1]))
        JSON.parse(data[1]).forEach(e => {
            console.log(e)
            fs.appendFile(`./database/record/${e.username}.txt`, " ", function (err) {
                if (err) throw err;
                console.log(' record Updated!');
            });
        });
    }
}

module.exports = { allListen }