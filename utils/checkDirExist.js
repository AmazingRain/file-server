const fs = require('fs');

function checkDirExist(name) {
    if (!fs.existsSync(name)) {
        fs.mkdirSync(name);
    }
}

module.exports = checkDirExist;