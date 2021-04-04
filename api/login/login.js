
function getInfo(fs, io, data) {
    fs.readFile(`./database/record/${data[1]}.txt`, 'utf8', (err, jsonFile) => {
        if (err) {
            console.error(err)
            return
        }
        io.to(data[2]).emit("get_info_One", jsonFile)

    })

    fs.readFile(`./database/record/${data[1]}Correct.txt`, 'utf8', (err, jsonFile) => {
        if (err) {
            console.error(err)
            return
        }
        io.to(data[2]).emit("get_info_OneCorrect", jsonFile)

    })
    fs.readFile(`./database/record/${data[1]}unCorrect.txt`, 'utf8', (err, jsonFile) => {
        if (err) {
            console.error(err)
            return
        }
        io.to(data[2]).emit("get_info_OneunCorrect", jsonFile)

    })
};



function allListen(fs, io, data) {
    if (data[0] === "get_info_One") {
        getInfo(fs, io, data);
    }
}
module.exports = { allListen }