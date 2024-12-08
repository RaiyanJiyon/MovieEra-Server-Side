const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // await client.connect();

        const movieCollection = client.db("movieDB").collection("movies");
        const favoriteCollection = client.db("movieDB").collection("favoriteMovies");

        app.get('/movies', async (req, res) => {
            try {
                const query = movieCollection.find();
                const result = await query.toArray();
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to fetch movie data" });
            };
        });

        app.get('/movies/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await movieCollection.findOne(query);
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to fetch movie data" });
            }
        })

        app.post('/movies', async (req, res) => {
            const newMovie = req.body;
            console.log(newMovie);

            try {
                const result = await movieCollection.insertOne(newMovie);
                res.status(200).send(result);
            } catch (error) {
                console.error(error.message);
                res.status(500).send({ error: "Failed to add movie" });
            };
        });

        app.delete('/movies/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await movieCollection.deleteOne(query);
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to remove movie" });
            };
        });

        app.put('/movies/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedMovie = req.body;
            const movie = {
                $set: {
                    moviePoster: updatedMovie.moviePoster,
                    movieTitle: updatedMovie.movieTitle,
                    genre: updatedMovie.genre,
                    duration: updatedMovie.duration,
                    releaseYear: updatedMovie.releaseYear,
                    summary: updatedMovie.summary,
                    rating: updatedMovie.rating,
                }
            };
            try {
                const result = await movieCollection.updateOne(filter, movie); // Use await here
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to update movie" });
            };
        });

        app.get('/featured-movies', async (req, res) => {
            try {
                const result = await movieCollection.find().sort({ rating: -1 }).limit(6).toArray();
                res.status(200).send(result);
            }
            catch (error) {
                res.status(500).send({ error: "Failed to fetch featured movies" });
            }
        });

        app.get('/favorite/:email', async (req, res) => {
            try {
                const email = req.params.email;
                const query = { email: email };
                const result = await favoriteCollection.find(query).toArray();
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to fetch favorite movies" });
            }
        })

        app.post('/favorite', async (req, res) => {
            try {
                const favoriteMovie = req.body;
                const result = await favoriteCollection.insertOne(favoriteMovie);
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to add to favorite movie" });
            };
        });

        app.delete('/favorite/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await favoriteCollection.deleteOne(query);
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to remove movie from favorite list." });
            }
        });

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
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
