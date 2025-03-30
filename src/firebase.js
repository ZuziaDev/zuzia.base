const admin = require('firebase-admin');
const fs = require('fs');

class Firebase {
    constructor(serviceAccount, databaseURL) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: databaseURL
        });
        this.db = admin.database();
    }

    // Set / Push Fonksiyonları
    async set(path, value) {
        await this.db.ref(path).set(value);
    }

    async push(path, value) {
        await this.db.ref(path).push(value);
    }

    // Getirme / Alma Fonksiyonları
    async get(path) {
        const snapshot = await this.db.ref(path).once('value');
        return snapshot.val();
    }

    async fetch(path) {
        return await this.get(path);
    }

    async fetchAll() {
        const snapshot = await this.db.ref('/').once('value');
        return snapshot.val();
    }

    async all() {
        return await this.fetchAll();
    }

    // Silme / Kaldırma Fonksiyonları
    async remove(path) {
        await this.db.ref(path).remove();
    }

    async delete(path) {
        await this.remove(path);
    }

    async deleteKey(objectPath, key) {
        const data = await this.get(objectPath);
        if (data) {
            delete data[key];
            await this.set(objectPath, data);
        }
    }

    // Mantıksal Fonksiyonlar
    async has(path) {
        const snapshot = await this.db.ref(path).once('value');
        return snapshot.exists();
    }

    // Matematik Fonksiyonları
    async add(path, value) {
        const currentValue = await this.get(path) || 0;
        await this.set(path, currentValue + value);
    }

    async subtract(path, value) {
        const currentValue = await this.get(path) || 0;
        await this.set(path, currentValue - value);
    }

    async math(path, operator, value) {
        let currentValue = await this.get(path) || 0;
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
        await this.set(path, currentValue);
    }

    // Yedekleme Fonksiyonları
    async setBackup(filePath) {
        const data = await this.fetchAll();
        fs.writeFileSync(filePath, JSON.stringify(data));
    }

    async loadBackup(filePath) {
        const data = JSON.parse(fs.readFileSync(filePath));
        for (const key in data) {
            await this.set(key, data[key]);
        }
    }
}

module.exports = Firebase;
