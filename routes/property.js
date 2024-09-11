const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Route to get all properties
router.get('/properties', (req, res) => {
  // Reading the properties.json file
  const filePath = path.join(__dirname, '../data/properties.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load properties' });
    }
    // Parse the JSON data
    const properties = JSON.parse(data);
    res.json(properties);
  });
});

module.exports = router;
