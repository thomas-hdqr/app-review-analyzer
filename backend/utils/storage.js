const fs = require('fs');
const path = require('path');

/**
 * Read a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Object|Array|null} - Parsed JSON data or null if file doesn't exist
 */
function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    return null;
  }
}

/**
 * Write data to a JSON file
 * @param {string} filePath - Path to the JSON file
 * @param {Object|Array} data - Data to write
 * @returns {boolean} - Success status
 */
function writeJsonFile(filePath, data) {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing JSON file ${filePath}:`, error);
    return false;
  }
}

/**
 * Delete a file
 * @param {string} filePath - Path to the file
 * @returns {boolean} - Success status
 */
function deleteFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
}

/**
 * List all JSON files in a directory
 * @param {string} dirPath - Path to the directory
 * @returns {Array} - List of file paths
 */
function listJsonFiles(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      return [];
    }
    
    return fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(dirPath, file));
  } catch (error) {
    console.error(`Error listing JSON files in ${dirPath}:`, error);
    return [];
  }
}

/**
 * Get file stats
 * @param {string} filePath - Path to the file
 * @returns {Object|null} - File stats or null if file doesn't exist
 */
function getFileStats(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    return fs.statSync(filePath);
  } catch (error) {
    console.error(`Error getting file stats for ${filePath}:`, error);
    return null;
  }
}

module.exports = {
  readJsonFile,
  writeJsonFile,
  deleteFile,
  listJsonFiles,
  getFileStats
}; 