const Database = require('./src/database');
const Firebase = require('./src/firebase');
const MongoDB = require('./src/mongobase');
const BSONBase = require('./src/bsonbase')
const YAMLBase = require('./src/yamlbase');
const { exec } = require('child_process');
const { promisify } = require('util');
const moment = require('moment');
const execAsync = promisify(exec);

function version() {
    const currentVersion = require('./package.json').version;
    return currentVersion;
}
/**
 * Converts a hexadecimal color code to an RGB object.
 * @param {string} hex - The hexadecimal color code.
 * @returns {{ red: number, green: number, blue: number }} - The RGB color representation.
 */
function convertHexToRgb(hex) {
    const hexValue = hex.startsWith('#') ? hex.slice(1) : hex;
    const red = parseInt(hexValue.slice(0, 2), 16);
    const green = parseInt(hexValue.slice(2, 4), 16);
    const blue = parseInt(hexValue.slice(4, 6), 16);
    return { red, green, blue };
}

/**
 * Logs a message to the console with colored formatting.
 * @param {Object} options - The log options.
 * @param {string} options.name - The name to display in the log.
 * @param {string} options.text - The log message.
 * @param {string} options.hex - The hexadecimal color code for the name.
 */
function updateLogs({ name, text, hex: hexColor}) {
    const rgbColor = convertHexToRgb(hexColor);
    const white = convertHexToRgb("#ffffff");
    const currentTime = moment().format("DD-MM-YYYY HH:mm:ss");
    const formattedText = `\x1b[1m\x1b[38;2;${rgbColor.red};${rgbColor.green};${rgbColor.blue}m[${currentTime}]\x1b[38;2;${white.red};${white.green};${white.blue}m - [${name}]\x1b[0m\x1b[38;2;${white.red};${white.green};${white.blue}m ${text}\x1b[0m`;
        console.log(formattedText);
}

/**
 * Retrieves the current version from the package.json file.
 * @returns {string} - The current version.
 */
function getCurrentVersion() {
    const { version } = require('./package.json');
    return version;
}

/**
 * Retrieves the latest version of the zuzia.base package from npm.
 * @returns {Promise<string>} - The latest version.
 */
async function getLatestVersion() {
    const { stdout } = await execAsync('npm show zuzia.base version');
    return stdout.trim();
}

/**
 * Checks for updates and installs the latest version if available.
 */
async function autoUpdate() {
    try {
        const currentVersion = getCurrentVersion();
        const latestVersion = await getLatestVersion();

        if (currentVersion !== latestVersion) {
            await execAsync('npm install zuzia.base@latest');
            updateLogs({
                name: "Zuzia.Base Auto Update",
                text: `Zuzia.Base has been updated from version ${currentVersion} to ${latestVersion}. Check out the latest features at https://www.npmjs.com/package/zuzia.base`,
                hex: "#c88deb"
            });
        }
    } catch (error) {
        updateLogs({
            name: "Zuzia.Base Auto Update Error",
            text: `An error occurred during the update: ${error.message}`,
            hex: "#ff3650"
        });
    }
}

module.exports = { Database, Firebase, MongoDB, BSONBase, YAMLBase, autoUpdate, version };
