const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const csvtojson = require('csvtojson');
const mongoose = require('mongoose');
const MappedData = require('./models/MappedData'); // Adjust the path as needed

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON and handle CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to handle CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// MongoDB connection
// mongoose.connect('mongodb://your-mongodb-connection-string', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Example endpoint for handling CSV uploads
app.post('/api/upload', upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded.' });
    }

    // Convert the uploaded CSV file to JSON
    const csvData = await csvtojson().fromString(req.file.buffer.toString());

    // Handle the CSV data as needed (you can save it to the database)
    // For example, assuming csvData is an array of objects
    await MappedData.insertMany(csvData);

    // Respond with a success message
    res.json({ message: 'CSV data uploaded and saved to MongoDB.' });
  } catch (error) {
    console.error('Error handling CSV upload:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Example endpoint for handling mapping submissions
app.post('/api/submit-mapping', async (req, res) => {
  try {
    const { csvData, columnMapping } = req.body;

    // Assuming csvData is an array of objects, use it to save to the MongoDB database
    await MappedData.insertMany(csvData);

    // Respond with a success message
    res.json({ message: 'Mapping submitted and data saved to MongoDB.' });
  } catch (error) {
    console.error('Error handling mapping submission:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
