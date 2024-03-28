const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { default: mongoose } = require('mongoose')


const port = process.env.PORT || 8000
const app = express()

app.use(cors())
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/engineData',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('connected to the database');
}).catch(err => console.log('error connecting to database ',err ))

//Mongoose schema for engine data
const engineDataSchema = new mongoose.Schema({
    voltage: Number,
    current: Number,
    power: Number,
    powekVA: Number,
    frequency: Number,
    pressure: Number,
    temperature: Number
}, {timestamps: true})


app.get('/voltage',
    (req,res)=>{
        try{
             res.status(200).json({
                message:{
                    title: 'getting voltage values',
                    detail:12
                }
            })
        }catch(err){
            console.error(err)
        }
    }

)

app.get('/current',
    (req,res)=>{
        res.status(200).json({
            message:{
                title: 'getting current values',
                detail:120
            }
        })
    }
)

app.get('/frequency',
    (req,res)=>{
        res.status(200).json({
            title: 'getting frequency values',
            detail: 49.5
        })
    }
)

app.get('/power',
   (req,res)=>{
    res.status(200).json({
        message:{
            title: 'getting power values',
            detail: 44
        }
    })
   }

)

app.get('/powerinKVA',(req, res)=>{
    res.status.json({
        message:{
            title: 'getting power values in KVA',
            detail: 44
        }
    })
})

app.get('/engine-running-hrs',(req, res)=>{
    res.status(200).json({
        message:{
            title: 'getting engine running status values',
            detail: 10
        }
    })
})

app.get('/engine-rpm',(req,res)=>{
    res.status(200).json({
        message:{
            title: 'getting engine RPM values',
            detail: 50
        }
    })
})


app.get('/coolant-temperature',(req,res)=>{
    res.status(200).json({
        message:{
            title: 'getting coolant temperature',
            detail: 50
        }
    })
})

app.get('/oil-pressure', (req,res)=>{
    res.status(200).json({
        message:{
            title: 'getting oil pressure',
            detail: 50
        }
    })
})

app.get('/engine/:id/voltage',(req,res)=>{
    res.status(200)
})

app.post('/webhook', (req, res)=>{
    const data = req.body

    console.log('data recieved from IOT', data);
    res.sendStatus(200)
})

app.post('api/data', async(req,res)=>{
    try{
        const newData = new EngineData(req.body)
        await newData.save()
        res.sendStatus(201)
}
catch(error){
    console.error('Error saving data: ',error)
    res.sendStatus(500)
}
})

app.listen(port,()=>{
    console.log('server running ');
})