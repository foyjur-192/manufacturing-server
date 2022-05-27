const express = require('express')
const cors = require ('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const app = express()
const port =  process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3vzc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// function verifyJWT (req, res, next){
//   const authHeader = req.headers.authorization;
//   if(!authHeader){
//     return res.status(401).send({message: 'UnAuthorized user'});
//   }
//   const token = authHeader.split(' ')[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
  
//     if(err){
//     return res.status(403).send({message: 'Forbidden access'})
//     }
//     req.decoded = decoded;
//     next();
//   });

// }



async function run(){

try {
await client.connect();

//Headlight database
const serviceCollection = client.db('head_light').collection('services')

app.get('/service',  async (req, res) => {
    const query = {};
    const cursor = serviceCollection.find(query);
    const services = await cursor.toArray();
    res.send(services);
});

app.post('/service', async (req, res) => {
  const service = req.body;
  const result = await serviceCollection.insertOne(service);
   res.send({success: true,  result});
})


//Ac control database
const controlCollection = client.db('ac_control').collection('control')

app.get('/control', async (req, res) => {
  const query = {};
  const cursor = controlCollection.find(query);
  const control = await cursor.toArray();
  res.send(control);
});

// Ac Frame database
const frameCollection = client.db('ac_frame').collection('frame')

app.get('/frame', async (req, res) => {
  const query = {};
  const cursor = frameCollection.find(query);
  const frame = await cursor.toArray();
  res.send(frame);
});

// Ac Review database
const reviewCollection = client.db('customer_review').collection('review')

app.get('/review', async (req, res) => {
  const query = {};
  const cursor = reviewCollection.find(query);
  const review = await cursor.toArray();
  res.send(review);
});

app.post('/reviews', async (req, res) => {
  const reviews = req.body;
  const result = await reviewCollection.insertOne(reviews);
   res.send({success: true,  result});
})


//Get order from buyer
const orderCollection = client.db('got_order').collection('order')

app.get('/ordering', async (req, res) => {
  const user = req.query.user;
    const query = {user: user};
    const ordering = await orderCollection.find(query).toArray();
    res.send(ordering);
 


});


  app.post('/ordering', async (req, res) => {
    const ordering = req.body;
    const result = await orderCollection.insertOne(ordering);
     res.send({success: true,  result});
  })

  app.delete('/ordering/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await orderCollection.deleteOne(query);
    res.send(result);
  })


//User Update
const userCollection = client.db('got_order').collection('users');

app.get('/user', async(req, res) => {
  const users = await userCollection.find().toArray();
  res.send(users);
});




app.put('/user/:email', async (req, res) => {
const email = req.params.email;
const user = req.body;
const filter = {email: email};
const options = {upsert: true};
const updateDoc = {
$set: user,
};
const result = await userCollection.updateOne(filter, updateDoc,options);
const accessToken = jwt.sign({email: email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
res.send({result, accessToken});

})








}
finally{

}







}
    run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('Hello Car Parts!')
})

app.listen(port, () => {
  console.log(`Manufacturer app listening on port ${port}`)
})