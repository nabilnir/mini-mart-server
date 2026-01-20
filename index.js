require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {



        const db = client.db('miniMartDB');
        const itemsCollection = db.collection('items');

        // GET all items
        app.get('/items', async (req, res) => {
            const result = await itemsCollection.find().toArray();
            res.send(result);
        });

        // GET single item
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            // Validate ObjectId
            try {
                const query = { _id: new ObjectId(id) };
                const result = await itemsCollection.findOne(query);
                res.send(result);
            } catch (error) {
                res.status(400).send({ message: "Invalid ID format" });
            }
        });

        // POST new item (Protected usually, but open for this demo/mock auth)
        app.post('/items', async (req, res) => {
            const item = req.body;
            const result = await itemsCollection.insertOne(item);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Mini Mart Server is running');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
