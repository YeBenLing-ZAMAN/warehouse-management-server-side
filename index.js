  
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;


//middleware 
app.use(cors());
app.use(express.json()); // body theke data parse korte lage 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yeb55.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    console.log('data base connected');
    client.close();
});

app.get('/', (req, res) => {
    res.send('Hello World! this is zaman')
})

app.listen(port, () => {
    console.log(`app running port ${port}`)
})