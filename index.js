
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
        const wareHouseCollection = client.db('allItems').collection('packageService')


        /* for handle JWT */
        app.post('/login', async (req, res) => {
            const user = req.body;
            var accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accesstoken });

        })

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
            // console.log(newitem);
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

        /* items update post req handle  */
        app.put('/item/:itemId', async (req, res) => {
            const id = req.params.itemId;
            // console.log(id)
            const updataItem = req.body;
            // console.log(updataUser);

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updataItem.quantity
                },
            };
            const result = await itemsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        /* for service ware house package */
        app.get('/warehouse', async (req, res) => {
            const query = {};
            const cursor = wareHouseCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        /* handle my Items with JWT */
        app.get('/myitmes', verifyJWT, async (req, res) => {
            const decodedEmail = req?.decoded?.email;
            const email = req.query.email;
            // console.log(decodedEmail , email);
            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = orderCollection.find(query);
                const result = await cursor.toArray();
                res.send(result);
            }else{
                res.status(403).send({message:'forbidden access'})
            }
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