# Zuzia Base Database Module

Zuzia Base Database Module is a simple and versatile module to manage your data in JSON files, Firebase Realtime Database, MongoDB, BSON, or YAML. This module provides easy-to-use functions to set, get, remove, and manipulate data.

## Installation

First, install the module using npm:

```bash
npm install @zuzia.dev/zuzia.base
```

## Configuration

### Firebase Configuration

To use Firebase Realtime Database, you need to set up your Firebase service account. Follow these steps to get your service account key:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Navigate to **Project Settings** (the gear icon).
4. Go to the **Service accounts** tab.
5. Click **Generate new private key**, which downloads a JSON file with your credentials.

Create a `config.js` file in your project to store your Firebase configuration:

```javascript
module.exports = {
    serviceAccountKey: require('./path/to/serviceAccountKey.json'), // Path to your service account key file
    databaseURL: 'https://your-database-name.firebaseio.com' // Your Firebase database URL
};
```

### MongoDB Configuration

To use MongoDB, you need to have a MongoDB connection URI. You can get this from your MongoDB Atlas account or your own MongoDB server.

```javascript
const MongoDB = require('@zuzia.dev/zuzia.base');

const mongoDb = new MongoDB('your-mongodb-uri', 'your-database-name');
await mongoDb.connect();
```

### BSON Configuration

To use BSON, you need to specify the path to your BSON database file.

```javascript
const BSONBase = require('@zuzia.dev/zuzia.base');

const bsonDb = new BSONBase('test.bson');
```

### YAML Configuration

To use YAML, you need to specify the path to your YAML database file.

```javascript
const YAMLBase = require('@zuzia.dev/zuzia.base');

const yamlDb = new YAMLBase('test.yaml');
```

## Usage

### Initializing the Database

You can use this module to interact with local JSON files, Firebase Realtime Database, MongoDB, SQLite, BSON, or YAML.

### Local JSON File Database

```javascript
const { Database } = require('@zuzia.dev/zuzia.base');

const db = new Database('myDatabase.json');

// Set a value
db.set('test.data', { key: true, key2: "true" });

// Get a value
const data = db.get('test.data');
console.log(data);

// Remove a value
db.remove('test.data');
```

### Firebase Realtime Database

```javascript
const { Firebase } = require('@zuzia.dev/zuzia.base');
const config = require('./config');

const firebaseDb = new Firebase(config.serviceAccountKey, config.databaseURL);

// Set a value
await firebaseDb.set('test/data', { key: true, key2: "true" });

// Get a value
const data = await firebaseDb.get('test/data');
console.log(data);

// Remove a value
await firebaseDb.remove('test/data');
```

### MongoDB

```javascript
const MongoDB = require('@zuzia.dev/zuzia.base');

const mongoDb = new MongoDB('your-mongodb-uri', 'your-database-name');
await mongoDb.connect();

// Set a value
await mongoDb.set('testCollection', { key: true, key2: "true" });

// Get a value
const data = await mongoDb.get('testCollection', { key: true });
console.log(data);

// Remove a value
await mongoDb.remove('testCollection', { key: true });

await mongoDb.close();
```

### BSON

```javascript
const BSONBase = require('@zuzia.dev/zuzia.base');

const bsonDb = new BSONBase('test.bson');

// Set a value
bsonDb.set('test.data', { key: true, key2: "true" });

// Get a value
const data = bsonDb.get('test.data');
console.log(data);

// Remove a value
bsonDb.remove('test.data');
```

### YAML

```javascript
const YAMLBase = require('@zuzia.dev/zuzia.base');

const yamlDb = new YAMLBase('test.yaml');

// Set a value
yamlDb.set('test.data', { key: true, key2: "true" });

// Get a value
const data = yamlDb.get('test.data');
console.log(data);

// Remove a value
yamlDb.remove('test.data');
```

## API

### Local JSON File Database

- `set(path, value)`: Sets a value at the specified path.
- `get(path)`: Gets a value from the specified path.
- `remove(path)`: Removes a value at the specified path.
- `add(path, value)`: Adds a value to the specified path.
- `subtract(path, value)`: Subtracts a value from the specified path.
- `push(path, value)`: Pushes a value to an array at the specified path.
- `delete(path, index)`: Deletes a value or index from an array at the specified path.
- `deleteKey(objectPath, key)`: Deletes a key from an object at the specified path.
- `has(path)`: Checks if a value exists at the specified path.
- `fetchAll()`: Fetches all data.
- `clear()`: Clears all data.
- `destroy()`: Deletes the database file.

### Firebase Realtime Database

- `set(path, value)`: Sets a value at the specified path.
- `get(path)`: Gets a value from the specified path.
- `remove(path)`: Removes a value at the specified path.
- `add(path, value)`: Adds a value to the specified path.
- `subtract(path, value)`: Subtracts a value from the specified path.
- `push(path, value)`: Pushes a value to an array at the specified path.
- `deleteKey(objectPath, key)`: Deletes a key from an object at the specified path.
- `has(path)`: Checks if a value exists at the specified path.
- `fetchAll()`: Fetches all data.

### MongoDB

- `set(collectionName, document)`: Sets a value in the specified collection.
- `push(collectionName, query, update)`: Pushes a value to an array field in the specified collection.
- `get(collectionName, query)`: Gets a value from the specified collection.
- `fetchAll(collectionName)`: Fetches all data from the specified collection.
- `remove(collectionName, query)`: Removes a value from the specified collection.
- `deleteMany(collectionName, query)`: Deletes multiple values from the specified collection.
- `has(collectionName, query)`: Checks if a value exists in the specified collection.
- `add(collectionName, query, field, value)`: Adds a value to a specified field in the specified collection.
- `subtract(collectionName, query, field, value)`: Subtracts a value from a specified field in the specified collection.

### BSON

- `set(key, value)`: Sets a value at the specified key.
- `push(key, value)`: Pushes a value to an array at the specified key.
- `get(key)`: Gets a value from the specified key.
- `fetch(key)`: Fetches a value from the specified key.
- `fetchAll()`: Fetches all data.
- `remove(key)`: Removes a value at the specified key.
- `delete(key)`: Deletes a value at the specified key.
- `deleteKey(objectKey, key)`: Deletes a key from an object at the specified key.
- `has(key)`: Checks if a value exists at the specified key.
- `add(key, value)`: Adds a value to the specified key.
- `subtract(key, value)`: Subtracts a value from the specified key.
- `math(key, operator, value)`: Performs a mathematical operation on the specified key.
- `setBackup(file

Path)`: Creates a backup of the database to the specified file path.
- `loadBackup(filePath)`: Loads the database from the specified backup file path.
- `clear()`: Clears all data.
- `destroy()`: Deletes the database file.

### YAML

- `set(key, value)`: Sets a value at the specified key.
- `push(key, value)`: Pushes a value to an array at the specified key.
- `get(key)`: Gets a value from the specified key.
- `fetch(key)`: Fetches a value from the specified key.
- `fetchAll()`: Fetches all data.
- `remove(key)`: Removes a value at the specified key.
- `delete(key)`: Deletes a value at the specified key.
- `deleteKey(objectKey, key)`: Deletes a key from an object at the specified key.
- `has(key)`: Checks if a value exists at the specified key.
- `add(key, value)`: Adds a value to the specified key.
- `subtract(key, value)`: Subtracts a value from the specified key.
- `math(key, operator, value)`: Performs a mathematical operation on the specified key.
- `setBackup(filePath)`: Creates a backup of the database to the specified file path.
- `loadBackup(filePath)`: Loads the database from the specified backup file path.
- `clear()`: Clears all data.
- `destroy()`: Deletes the database file.

## Backup

### Local JSON File Database

- `setBackup(filePath)`: Sets a backup file path.
- `loadBackup()`: Loads data from the backup file.

### Firebase Realtime Database

- `setBackup(filePath)`: Sets a backup file path.
- `loadBackup(filePath)`: Loads data from the backup file.

### MongoDB

- `setBackup(collectionName, filePath)`: Creates a backup of the specified collection and saves it to the specified file path.
- `loadBackup(collectionName, filePath)`: Loads data from the specified backup file into the specified collection.

### BSON

- `setBackup(filePath)`: Creates a backup of the database to the specified file path.
- `loadBackup(filePath)`: Loads the database from the specified backup file path.

### YAML

- `setBackup(filePath)`: Creates a backup of the database to the specified file path.
- `loadBackup(filePath)`: Loads the database from the specified backup file path.

## Version and Auto Update

- `version()`: Gets the current version of the module.
- `autoUpdate()`: Automatically updates the module to the latest version.

## License

This project is licensed under the MIT.