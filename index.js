const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.xyujo4m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const servicesCollection = client.db("SnapFix").collection("services");
        const purchaseCollection = client.db("SnapFix").collection("bookings");

        // services api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find().limit(6);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/all-services', async (req, res) => {
            const cursor = servicesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/all-services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.send(result);
        });

        app.get('/services-provider', async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query.providerEmail = email;
            }
            const services = await servicesCollection.find(query).toArray();
            res.send(services);
        });

        app.post('/services', async (req, res) => {
            const services = req.body;
            const result = await servicesCollection.insertOne(services);
            res.send(result);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.send(result);
        });

        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: updatedData
            };
            const result = await servicesCollection.updateOne(filter, updatedDoc);
            res.send(result);
        });

        app.delete('/all-services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        });

        // purchase api

        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = {
                userEmail: email
            }
            const result = await purchaseCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/bookings', async (req, res) => {
            const bookings = req.body;
            const result = await purchaseCollection.insertOne(bookings);
            res.send(result);
        });

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await purchaseCollection.deleteOne(query);
            res.send(result);
        });





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Welcome to SnapFix Service Web Application")
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});