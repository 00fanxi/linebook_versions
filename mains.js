const express = require('express');
const app =express();
const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect('mongodb://localhost:27017/local', function(err,client){
  if(err) {return console.log(err)}
    console.log('conncected with DB')
  db = client.db('local');
  db.collection('local').insertOne({__id:1,name:'James',age:20},function(err,result){
    console.log('save complete')
  });

    app.listen(8080, function(){
		console.log('listening on 8080');
	});

});


app.use(express.urlencoded({extended: true}))

app.get('/pet',function(req,res){
	res.send('asdf')
});

app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html')
});

app.post('/add',function(req,res){
	res.send('전송완료');
	console.log(req.body.title);
});
