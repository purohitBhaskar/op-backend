const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://bhaskarp:PrtqT4JE8HxFV0La@cluster0.rgdzykc.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

// Define schema for IoT data
const IoTDataSchema = new mongoose.Schema({
    sensorId: String,
    data: Number,
    timestamp: { type: Date, default: Date.now }
});

const IoTData = mongoose.model('IoTData', IoTDataSchema);

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// POST endpoint for receiving data from IoT device
app.post('/iot/data', async (req, res) => {
    const { sensorId, data } = req.body;
    if (!sensorId || !data) {
        return res.status(400).json({ error: 'Missing sensorId or data field' });
    }

    // Create new IoTData document
    const newData = new IoTData({
        sensorId,
        data
    });

    try {
        // Save data to MongoDB
        await newData.save();
        console.log('Data saved successfully');
        res.status(201).json({ message: 'Data saved successfully' });
    } catch (err) {
        console.error('Error saving data: ', err);
        res.status(500).json({ error: 'Error saving data' });
    }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
