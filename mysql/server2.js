let express = require('express');
let app = express()
let mysql = require('mysql');
app.use(express.json());

var connection=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'thakur'
})

app.get("/create_database",(req,res)=>{
  connection.query("CREATE DATABASE IF NOT EXISTS my_sql;",(err)=>{
    if(!err){
      res.send("database created sucessfully.....    ")
    }else{
      res.send(err)
    } 
  })
})

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'root',
    password : 'thakur',
    database : 'my_sql'
  }
});


app.get("/create_table",(req,res)=>{
  knex.schema.hasTable('navgurukul_data').then((exists)=>{
  if (!exists){
    return knex.schema.createTable('navgurukul_data',(t)=>{
      t.increments('id').primary();
      t.string('name');
      t.string('address');
      t.string('number');
      res.send("table_created sucessfully...   ")
    })
  }else{
    console.log("allready created")
    res.send("allready created")
  }
})
})


app.post("/insert_data",(req,res)=>{
  knex('navgurukul_data')
  .insert({
    "id" : req.body.id,
    "name" : req.body.name,
    "address" : req.body.address,
    "number" : req.body.number
  })
  .then((data)=>{
  res.send("data inserted sucessfully...   ")
  console.log(data);
  })
  .catch((err)=>{
  res.send(err)
  console.log(err);
  })
})


app.use("/update_data/:id",(req,res)=>{
  var id = req.params.id
  knex('navgurukul_data')
  .where("id",id)
  .update({
    "name":req.body.name,
    "address":req.body.address,
    "number":req.body.number
  })
  .then((data)=>{
    res.send("data updated sucessfully....   ")
    console.log(data);
  })
  .catch((err)=>{
    res.send("data not update")
    console.log(err);
    
  })
})

app.get("/get_data",(req,res)=>{
  knex('navgurukul_data')
  .select("*")
  .then((data)=>{
    res.send(data)
    console.log(data);
  })
  .catch((err)=>{
    res.send(err)
    console.log(err);
    
  })
})

app.get("/get_data/:id",(req,res)=>{
  var id=req.params.id
  knex('navgurukul_data')
  .select("*")
  .where("id",id)
  .then((data)=>{
    res.send(data)
    console.log(data);
  })
  .catch((err)=>{
    res.send(err)
    console.log(err);
  })
})

app.delete("/delete_data/:id",(req,res)=>{
  var id = req.params.id
  knex("navgurukul_data")
  .delete()
  .where("id",id)
  .then(()=>{
    res.send("deleted sucessfully")
    console.log("deleted sucessfully");
  })
  .catch((err)=>{
    res.send(err)
    console.log(err);
  })
})


app.get("/join_data",(req,res)=>{
  knex()
  .from('navgurukul_data')
  .join('navgurukul' ,function(){
      this.on('navgurukul_data.name','navgurukul.name')
  })
  .then((data)=>{
    res.send("joined sucessfully")
    console.log(data);
  })
  .catch((err)=>{
    res.send(err)
    console.log(err);
  })

})



app.listen(5000,()=>{
  console.log("working....")
})
