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
    voltage:{
        type: String,
        required: true
    }, 
    power:{
        type: String,
        required: true
    }, 
    kw:{
        type: String,
        required: true
    }, 
    kva:{
        type: String,
        required: true
    }, 
    powerFactor:{
        type: String,
        required: true
    }, 
    current:{
        type: String,
        required: true
    }, 
    engineRunningTime:{
        type: String,
        required: true
    }, 
    frequency:{
        type: String,
        required: true
    }, 
    engineRPM:{
        type: String,
        required: true
    }, 
    coolerTemp:{
        type: String,
        required: true
    }, 
    oilPressure:{
        type: String,
        required: true
    }, 
    batteryVoltage:{
        type: String,
        required: true
    },
    fuelLevel:{
        type: String,
        required: true
    },
    timestamp: { type: Date, default: Date.now }
});

const IoTData = mongoose.model('IoTData', IoTDataSchema);

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// POST endpoint for receiving data from IoT device
app.post('/iot/data', async (req, res) => {
    
    const { voltage, power, kw, kva, powerFactor, current, engineRunningTime, frequency, engineRPM, coolerTemp, oilPressure, batteryVoltage,fuelLevel } = req.body;
    if (!voltage || !power || !kw || !kva || !powerFactor || !current || !engineRunningTime || !frequency || !engineRPM || !coolerTemp || !oilPressure || !batteryVoltage || !fuelLevel) {
        return res.status(400).json({ error: 'Missing sensorId or data field' });
    }

    // Create new IoTData document
    const newData = new IoTData({
        voltage, 
        power, 
        kw, 
        kva, 
        powerFactor, 
        current, 
        engineRunningTime, 
        frequency, 
        engineRPM, 
        coolerTemp, 
        oilPressure, 
        batteryVoltage,
        fuelLevel
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

app.get('/iot/data',async (req,res)=>{
    try{
        const allData = await IoTData.find()

        if(allData.length === 0){
            return res.status(404).json({
                message: 'No Data Found!'
            })
        }
        res.status(200).json(allData)
    }catch(err){
        console.error('Error fetching Data: ',err)
        res.status(500).json({ error: 'Error fetching data'})
    }
})

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
