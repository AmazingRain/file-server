function getUploadDirName() {
    const time = new Date();
    const year = time.getFullYear();
    const month = pad(time.getMonth() + 1);
    const date = pad(time.getDate());
    return `${year}${month}${date}`;
}

function pad(name) {
    let temp = name.toString();
    if (temp.length === 2) {
        return temp;
    }
    return '0' + temp;
}

module.exports = getUploadDirName;