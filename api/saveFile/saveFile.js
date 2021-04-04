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
    } else if (data[0] === "SaveFileRead") {
        // console.log(SortMess(data[3]));
        if (typeof (data[3]) === "string") {
            let arrRS = [];
            let arrUncorrect = []
            let saveFile = SortMess(data[3]).split(" ");
            saveFile.forEach(e => {
                let checkExist = false;
                data[2].forEach(ee => {
                    if (ee === e) {
                        checkExist = true;
                        arrUncorrect.push(e);
                    }
                })
                if (!checkExist) {
                    arrRS.push(e);

                }
            });

            let textSave = "";
            arrRS.forEach(eee => {
                textSave += eee + " ";
            })
            fs.appendFile(`./database/record/${data[1]}Correct.txt`, " " + textSave, function (err) {
                if (err) throw err;
                console.log(' record Updated!textSave ');
            });
            let textSaveUncorrect = "";
            arrUncorrect.forEach(eee => {
                textSaveUncorrect += eee + " ";
            })
            fs.appendFile(`./database/record/${data[1]}unCorrect.txt`, " " + textSaveUncorrect, function (err) {
                if (err) throw err;
                console.log(' record Updated!textSaveUncorrect');
            });

        }



    } else if (data[1] !== null) {
        fs.appendFile(`./database/record/${data[0]}.txt`, " " + data[1], function (err) {
            if (err) throw err;
            console.log(' record Updated!');
        });
    }
}
module.exports = { allListen }



function SortMess(messCheck) {
    let messTemp;
    messTemp = messCheck.toLowerCase().replace(".", "").split(",").join("").split("!").join("").replace("?", "");
    return messTemp;
}