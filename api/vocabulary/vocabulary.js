function allListen(fs, io, data) {
    if (data[0] === "SaveFileNew") {
        let StringRightText;
        data[1].forEach(e => {
            StringRightText += " " + e;
        })
        fs.appendFile(`./database/record/${data[1]}Correct.txt`, StringRightText, function (err) {
            if (err) throw err;
            console.log(' record Updated!textSave ');
        });
        let StringWrongText;
        data[2].forEach(e => {
            StringWrongText += " " + e;
        })
        fs.appendFile(`./database/record/${data[1]}unCorrect.txt`, StringWrongText, function (err) {
            if (err) throw err;
            console.log(' record Updated!textSaveUncorrect');
        });
    } 
}
module.exports = { allListen }