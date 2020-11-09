const util = require('util');
const fs = require('fs');

let dirs = [];

function dirRead(dir) {
    let syncDir = util.promisify(fs.readdir);
    let syncFile = util.promisify(fs.readFile);
    return new Promise((resolve, reject) => {
        syncDir(dir).then(async (dirValue) => {
            let arr = [];
            for (let i = 0; i < dirValue.length; i++) {
                const element = dirValue[i];
                try {
                    arr.push(await syncFile(dir + element, 'utf-8').then((value) => JSON.parse(value)))
                } catch (error) {
                    console.error(error)
                }
            }
            resolve(arr);
        }).catch((err) => reject(err));
    })
}

function init(dirArray) {
    for (let i = 0; i < dirArray.length; i++) {
        const element = dirArray[i];
        dirs.push(dirRead(element))
    }
    return Promise.all(dirs).then((value) => {
        let obj = {};
        for (let i = 0; i < dirArray.length; i++) {
            const element = dirArray[i];
            let name = element.split('/')
            name = name[name.length - 1] !== '' ? name[name.length - 1] : name[name.length - 2];
            obj[name] = value[i]
        }
        return obj;
    });
}
module.exports = {
    init
}