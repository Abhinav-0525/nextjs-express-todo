const express = require('express')
const app = express()
let cors = require('cors')
const {ObjectId} = require('mongodb');
require('dotenv').config();


//to delete a todo

//to allow express to parse JSON files
app.use(express.json());

let mongoClient = require('mongodb').MongoClient;
//console.log(process.env.MONGO_URI);


app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

mongoClient.connect(process.env.MONGO_URI)
.then(client =>{
  let db = client.db('app-db');
  let todosCollection = db.collection('todos')
  app.set('todos', todosCollection);
  console.log("Connected to db");
})
.catch(err=>{
  console.log("This is the error: "+err);
})

app.use((req, res, next) => {
    todosCollection = req.app.get('todos');
    next();
})


//to get the todos
app.get('/get', async (req, res) => {
  
  let todos = await todosCollection.find({}).toArray();
  res.send({message:"Todos received", payload: todos})
})

//to add a todo
app.post('/add', async (req, res)=>{
  let todo = req.body;
  //console.log("request body***",todo);
  await todosCollection.insertOne(todo);
  res.send({message: "Todo added"})
})

//to delete a todo
app.delete('/delete/:id', async (req, res)=>{
  let id = req.params.id;
  let resp = await todosCollection.deleteOne({_id:new ObjectId(id)})
  res.send({message: "Todo deleted", resp: resp})
})

//makes files directory public via the path files
app.use('/files', express.static('files'))

app.listen(4000, () => {
  console.log(`Server running on port: ${4000}`)
})
