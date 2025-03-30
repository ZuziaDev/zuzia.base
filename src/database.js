const fs = require('fs');
const path = require('path');

const load = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 4));
const extension = (filePath) => {
    let parts = filePath.split('.');
    return parts[parts.length - 1];
};

let backup;
function saveFile(filePath, data) {
    const directory = path.dirname(filePath);

    // Klasör varsa oluştur, yoksa dosyayı oluştur
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data));
}
const Backupadd = (data) => {
    if (backup !== undefined) {
        fs.writeFileSync(backup, JSON.stringify(data, null, 4));
    }
};

class Database {
    constructor(file) {
        this.file = `./zuzia.base/${file}` || './zuzia.base/database.json';
        if (!fs.existsSync('./zuzia.base')) {
            fs.mkdirSync('./zuzia.base');
        }

        const filePath = path.resolve(this.file);
        const directory = path.dirname(filePath);

        // Klasör varsa oluştur, yoksa dosyayı oluştur
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        if (this.file === './zuzia.base/database.json') {
            try {
                load(this.file);
            } catch {
                write(this.file, {});
            }
        } else {
            if (!this.file.includes('./')) this.file = './' + this.file;
            if (extension(this.file) !== 'json') throw Error("the database file must end with .json");
            try {
                load(this.file);
            } catch {
                write(this.file, {});
            }
        }
    }

    setBackup(filePath) {
        if (!filePath) throw Error("a .json file must be mentioned for backups");
        if (extension(filePath) !== "json") throw Error("the backup file must end with .json");
        if (!filePath.includes('./')) filePath = './' + filePath;
        backup = filePath;
        try {
            load(backup);
        } catch {
            write(backup, {});
        }
        return;
    }

    loadBackup() {
        if (backup === undefined) throw Error("can't find a backup || a file to load");
        write(this.file, load(backup));
        return;
    }

    set(data, value) {
        if (!data) throw Error("no data to set");
        if (!value) throw Error("no value to set");

        let keys = data.split(".");
        let fileData = load(this.file);

        // Reference the last object in the hierarchy
        let lastObj = fileData;

        for (let i = 0; i < keys.length - 1; i++) {
            if (typeof lastObj[keys[i]] !== 'object') {
                // Eğer lastObj'un keys[i] özelliği bir nesne değilse, yeni bir nesne oluşturun
                lastObj[keys[i]] = {};
            }
            lastObj = lastObj[keys[i]];
        }

        // Set the value in the last object
        lastObj[keys[keys.length - 1]] = value;

        write(this.file, fileData);
        Backupadd(fileData);
        return;
    }

    remove(data) {
        if (!data) throw Error("no value to remove");
        let fileData = load(this.file);
        let keys = data.split(".");
        let lastKey = keys.pop();
        let lastObj = keys.reduce((obj, key) => obj[key] || {}, fileData);
        if (!lastObj[lastKey]) throw Error("mentioned data isn't in directory or cannot be reached");
        delete lastObj[lastKey];
        write(this.file, fileData);
        Backupadd(fileData);
        return;
    }

    add(data, value) {
        if (!data) throw Error("no data to add");
        if (!value) throw Error("no value to add");

        let keys = data.split(".");
        let fileData = load(this.file);

        // Reference the last object in the hierarchy
        let lastObj = fileData;
        for (let i = 0; i < keys.length - 1; i++) {
            lastObj = lastObj[keys[i]] || (lastObj[keys[i]] = {});
        }

        // Set the value in the last object
        if (typeof value === "number") {
            if (lastObj[keys[keys.length - 1]] === undefined) return this.set(data, value);
            if (isNaN(lastObj[keys[keys.length - 1]])) return this.set(data, value);
            lastObj[keys[keys.length - 1]] = lastObj[keys[keys.length - 1]] + value;
        } else {
            if (lastObj[keys[keys.length - 1]] === undefined) return this.set(data, value);
            if (isNaN(lastObj[keys[keys.length - 1]])) return this.set(data, value);
            lastObj[keys[keys.length - 1]] = lastObj[keys[keys.length - 1]] + value;
        }

        write(this.file, fileData);
        Backupadd(fileData);
        return;
    }

    subtract(data, value) {
        if (!data) throw Error("no data to subtract");
        if (!value) throw Error("no value to subtract");
        if (typeof value !== "number") throw Error(`The value to subtract must be a number, received type: ${typeof value}`);
        let fileData = load(this.file);
        if (fileData[data] === undefined) return this.set(data, value);
        if (isNaN(fileData[data])) return this.set(data, value);
        fileData[data] = fileData[data] - value;
        write(this.file, fileData);
        Backupadd(fileData);
        return;
    }

    deleteEach(data) {
        if (!data) throw Error("no data to deleteEach");
        let fileData = load(this.file);
        let keysToDelete = Object.keys(fileData).filter((key) => key.includes(data));

        keysToDelete.forEach((key) => {
            this.remove(key);
        });

        return;
    }

    push(array, value) {
        if (!array) throw Error("no array to push");
        if (!value) throw Error("no value to push to the array");
        let fileData = load(this.file);
        if (fileData[array] && Array.isArray(fileData[array])) {
            fileData[array].push(value);
            write(this.file, fileData);
        } else if (!fileData[array]) {
            this.set(array, [value]);
        }
        return;
    }

    delete(array, index) {
        if (!array) throw Error("no array to index/value delete");
        if (index === undefined) throw Error("no index/value to delete from the array");
        let fileData = load(this.file);
        if (!fileData[array] || !Array.isArray(fileData[array])) throw Error("the array to index/value delete doesn't exist or it's not an array");

        if (typeof index === "number") {
            fileData[array].splice(index, 1);
        } else if (isNaN(index)) {
            if (fileData[array].includes(index)) {
                fileData[array].splice(fileData[array].indexOf(index), 1);
            } else {
                throw Error("unable to find a value with the provided index/value to delete");
            }
        }

        write(this.file, fileData);
        return;
    }

    deleteKey(object, key) {
        if (!object) throw Error("no object to key delete");
        if (!key) throw Error("no key to delete from the object");
        let fileData = load(this.file);
        if (!fileData[object]) throw Error("the object to delete key doesn't exist in the database");
        if (typeof fileData[object] !== 'object') throw Error("the provided object to key delete is not an object in the database");

        delete fileData[object][key];
        write(this.file, fileData);
        return;
    }

    has(data) {
        if (!data) throw Error("no data to has function");
        let fileData = load(this.file);
        return fileData[data] !== undefined;
    }

    clear() {
        write(this.file, {});
        return;
    }

    fetchAll() {
        return load(this.file);
    }

    all() {
        return load(this.file);
    }

    destroy() {
        fs.unlinkSync(this.file);
        return;
    }

    get(data) {
        if (!data) throw Error("no data to get");

        let fileData = load(this.file);
        let keys = data.split(".");
        let currentObj = fileData;

        for (let i = 0; i < keys.length; i++) {
            currentObj = currentObj[keys[i]] || (currentObj[keys[i]] = {});
        }

        return currentObj;
    }

    fetch(data) {
        if (!data) throw Error("no data to fetch");

        let fileData = load(this.file);
        let keys = data.split(".");
        let currentObj = fileData;

        for (let i = 0; i < keys.length; i++) {
            currentObj = currentObj[keys[i]] || (currentObj[keys[i]] = {});
        }

        return currentObj;
    }

    objectFetch(object, key) {
        let fileData = load(this.file);
        if (!object) throw Error("no object to object fetch");
        if (!key) throw Error("no key to object fetch");

        let currentObject = fileData;
        const keys = object.split('.');
        for (let i = 0; i < keys.length; i++) {
            currentObject = currentObject[keys[i]] || (currentObject[keys[i]] = {});
        }

        if (!currentObject[key]) currentObject[key] = null;
        return currentObject[key];
    }

    arrayFetch(array, number) {
        let fileData = load(this.file);
        if (!array) throw Error("no array to array fetch");
        if (number === undefined) throw Error("no index/number to array fetch");

        let currentArray = fileData;
        const keys = array.split('.');
        for (let i = 0; i < keys.length; i++) {
            currentArray = currentArray[keys[i]] || [];
        }

        if (!currentArray[number]) currentArray[number] = null;
        return currentArray[number];
    }

    math(data, operator, value) {
        if (!data) throw Error("no data to math");
        if (!operator) throw Error("no operator to math");
        if (!value) throw Error("no value to math");
        if (typeof value !== "number") throw Error(`the value to math must be a number, received type: ${typeof value}`);
        let fileData = load(this.file);
        if (operator === "-") {
            return fileData[data] - value;
        } else if (operator === "+") {
            return fileData[data] + value;
        } else if (operator === "*") {
            return fileData[data] * value;
        } else if (operator === "/") {
            return fileData[data] / value;
        } else {
            throw Error("invalid operator to math, you can use only (-, +, *, /) (math) function");
        }
    }
}

module.exports = Database;
