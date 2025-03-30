const fs = require('fs');
const path = require('path');
const { BSON } = require('bson');

class BSONBase {
    constructor(file) {
        this.file = path.resolve(file);
        this.data = this.loadData();
    }

    loadData() {
        try {
            const fileBuffer = fs.readFileSync(this.file);
            return BSON.deserialize(fileBuffer);
        } catch (error) {
            return {};
        }
    }

    saveData() {
        const bsonData = BSON.serialize(this.data);
        fs.writeFileSync(this.file, bsonData);
    }

    // Set / Push Fonksiyonları
    set(key, value) {
        const keys = key.split('.');
        let data = this.data;

        while (keys.length > 1) {
            const k = keys.shift();
            if (!data[k]) data[k] = {};
            data = data[k];
        }

        data[keys[0]] = value;
        this.saveData();
    }

    push(key, value) {
        const keys = key.split('.');
        let data = this.data;

        while (keys.length > 1) {
            const k = keys.shift();
            if (!data[k]) data[k] = {};
            data = data[k];
        }

        if (!Array.isArray(data[keys[0]])) data[keys[0]] = [];
        data[keys[0]].push(value);
        this.saveData();
    }

    // Getirme / Alma Fonksiyonları
    get(key) {
        const keys = key.split('.');
        let data = this.data;

        while (keys.length > 0) {
            const k = keys.shift();
            if (!data[k]) return null;
            data = data[k];
        }

        return data;
    }

    fetch(key) {
        return this.get(key);
    }

    fetchAll() {
        return this.data;
    }

    // Silme / Kaldırma Fonksiyonları
    remove(key) {
        const keys = key.split('.');
        let data = this.data;

        while (keys.length > 1) {
            const k = keys.shift();
            if (!data[k]) return;
            data = data[k];
        }

        delete data[keys[0]];
        this.saveData();
    }

    delete(key) {
        this.remove(key);
    }

    deleteKey(objectKey, key) {
        const obj = this.get(objectKey);
        if (obj && typeof obj === 'object') {
            delete obj[key];
            this.saveData();
        }
    }

    // Mantıksal Fonksiyonlar
    has(key) {
        return this.get(key) !== null;
    }

    // Matematik Fonksiyonları
    add(key, value) {
        const currentValue = this.get(key) || 0;
        this.set(key, currentValue + value);
    }

    subtract(key, value) {
        const currentValue = this.get(key) || 0;
        this.set(key, currentValue - value);
    }

    math(key, operator, value) {
        let currentValue = this.get(key) || 0;

        switch (operator) {
            case '+':
                currentValue += value;
                break;
            case '-':
                currentValue -= value;
                break;
            case '*':
                currentValue *= value;
                break;
            case '/':
                currentValue /= value;
                break;
            default:
                throw new Error('Invalid operator');
        }

        this.set(key, currentValue);
    }

    // Yedekleme Fonksiyonları
    setBackup(filePath) {
        fs.copyFileSync(this.file, filePath);
    }

    loadBackup(filePath) {
        fs.copyFileSync(filePath, this.file);
        this.data = this.loadData();
    }

    // Temizleme / Yok Etme Fonksiyonları
    clear() {
        this.data = {};
        this.saveData();
    }

    destroy() {
        fs.unlinkSync(this.file);
    }
}

module.exports = BSONBase;
