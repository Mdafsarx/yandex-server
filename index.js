const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: [process.env.PUBLIC_URL,'http://localhost:3000'],
    credentials: true,
  })
)

// home path
app.get('/', (req, res) => {
  res.send('Hello World');
});


// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.zgmhkd0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

    // database and collection
    const yandex = client.db('yandex');
    const foods = yandex.collection('foods');


    //  apis
    app.get('/foods', async (req, res) => {
      let query = {}
      if (req.query.search) {
        query = { title: { $regex: req.query.search, $options: 'i' } }
      }
      const result = await foods.find(query).toArray();
      res.send(result);
    });



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally { }
}
run().catch(console.dir);



app.listen(2000, () => {
  console.log('Server is running on port 3000');
});