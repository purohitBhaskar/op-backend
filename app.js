const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


const port = process.env.PORT || 8000
const app = express()

app.use(cors())


app.get('')


app.listen(port,()=>{
    console.log('server running ');
})