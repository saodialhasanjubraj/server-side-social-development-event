const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
require('dotenv').config()
const cors = require('cors');

app.use(cors())
app.use(express.json())
// const cors = require('cors');

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.pgjmr.mongodb.net/?appName=Cluster0`;
//* create mongo client
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const port = process.env.PORT || 5101;
app.get('/', (req, res) => {
    res.send('hello')
})




async function run() {
    try {

        // await client.connect()
        const db = client.db('social_db')
        const socilaColl = db.collection('social_coll')
        const eventColl = db.collection('event_coll')

        app.get('/social', async (req, res) => {
            const result = await socilaColl.find().toArray()
            res.send(result)
        })
        app.post('/social', async (req, res) => {
            const newUser = req.body
            const result = await socilaColl.insertOne(newUser)
            res.send(result)
        })

        //* Event details
        app.post('/event', async (req, res) => {
            const newEvent = req.body
            const result = await eventColl.insertOne(newEvent)
            res.send(result)
        })


        app.get('/event', async (req, res) => {
            const result = await eventColl.find().sort({ time: -1 }).toArray()
            res.send(result)
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})