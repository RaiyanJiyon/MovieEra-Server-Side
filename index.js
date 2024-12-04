const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pkcxb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();

        const movieCollection = client.db("movieDB").collection("movies");

        app.get('/movies', async (req, res) => {
            try {
                const query = movieCollection.find();
                const result = await query.toArray();
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to fetch movie data" });
            };
        });

        app.post('/movies', async (req, res) => {
            const newMovie = req.body;
            console.log(newMovie);

            try {
                const result = await movieCollection.insertOne(newMovie);
                res.status(201).send(result);
            } catch (error) {
                console.error(error.message);
                res.status(500).send({ error: "Failed to add movie" });
            };
        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error('Connection error:', error);
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Express');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
