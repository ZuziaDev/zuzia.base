const { MongoClient } = require('mongodb');
const fs = require('fs');

class MongoDB {
    constructor(uri, dbName) {
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.dbName = dbName;
    }

    async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }

    async close() {
        try {
            await this.client.close();
        } catch (error) {
            console.error('Error closing MongoDB connection:', error);
        }
    }

    // Set / Push Fonksiyonları
    async set(collectionName, document) {
        const collection = this.db.collection(collectionName);
        await collection.insertOne(document);
    }

    async push(collectionName, query, update) {
        const collection = this.db.collection(collectionName);
        await collection.updateOne(query, { $push: update });
    }

    // Getirme / Alma Fonksiyonları
    async get(collectionName, query) {
        const collection = this.db.collection(collectionName);
        return await collection.findOne(query);
    }

    async fetchAll(collectionName) {
        const collection = this.db.collection(collectionName);
        return await collection.find({}).toArray();
    }

    // Silme / Kaldırma Fonksiyonları
    async remove(collectionName, query) {
        const collection = this.db.collection(collectionName);
        await collection.deleteOne(query);
    }

    async deleteMany(collectionName, query) {
        const collection = this.db.collection(collectionName);
        await collection.deleteMany(query);
    }

    // Mantıksal Fonksiyonlar
    async has(collectionName, query) {
        const collection = this.db.collection(collectionName);
        const count = await collection.countDocuments(query);
        return count > 0;
    }

    // Matematik Fonksiyonları
    async add(collectionName, query, field, value) {
        const collection = this.db.collection(collectionName);
        await collection.updateOne(query, { $inc: { [field]: value } });
    }

    async subtract(collectionName, query, field, value) {
        const collection = this.db.collection(collectionName);
        await collection.updateOne(query, { $inc: { [field]: -value } });
    }

    // Yedekleme Fonksiyonları
    async setBackup(collectionName, filePath) {
        const data = await this.fetchAll(collectionName);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    }

    async loadBackup(collectionName, filePath) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const collection = this.db.collection(collectionName);
        
        // Veritabanını temizle
        await this.deleteMany(collectionName, {});
        
        // Yedeği yükle
        if (Array.isArray(data)) {
            await collection.insertMany(data);
        } else {
            await collection.insertOne(data);
        }
    }
}

module.exports = MongoDB;
