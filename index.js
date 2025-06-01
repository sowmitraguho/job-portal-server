const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;

//middle wire
app.use(cors())
app.use(express.json())

//Mongdb connections

const uri = process.env.URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let jobsCollections;
let jobCategories;
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // get the jobs
    jobsCollections = client.db('Jobportal').collection('Jobs');
    jobCategories = client.db('Jobportal').collection('jobcategories');

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// get alljobs from database
app.get('/alljobs', async (req, res) => {
  if (!jobsCollections) {
    return res.status(503).send('Service unavailable, DB not connected yet.');
  }

  const allJobs = await jobsCollections.find().toArray();
 // console.log(allJobs);
  res.send(allJobs);
});

// get job categories
app.get('/jobcategories', async (req, res) => {
  if (!jobCategories) {
    return res.status(503).send('Service unavailable, DB not connected yet.');
  }

  const allcategories = await jobCategories.find().toArray();
  //console.log(allcategories);
  res.send(allcategories);
});


app.listen(port, () => {
  console.log(`job portal server listening on port ${port}`)
})
