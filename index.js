
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


//middleware 
app.use(cors());
app.use(express.json()); // body theke data parse korte lage 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yeb55.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const itemsCollection = client.db("allItems").collection("itmes")

        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.findOne(query);
            res.send(result);
        })

        /* add one item in DB by post request */
        app.post('/additem', async(req, res)=>{
            const newitem = req.body;
            console.log(newitem);
            const result = await itemsCollection.insertOne(newitem);
            res.send(result);
        })

        /* delete one item from DB by request */
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        })

    } finally {
        // await client.close()
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World! this is zaman')
})

app.listen(port, () => {
    console.log(`app running port ${port}`)
})