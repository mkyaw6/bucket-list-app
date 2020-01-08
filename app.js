// packages
const express=require('express');
const app=express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const methodOverride= require('method-override');

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); 

//routes
const daysRoutes=require("./routes/days.js");
const monthsRoutes=require("./routes/months.js");
const landingRoutes=require("./routes/landing.js");
app.use(daysRoutes);
app.use(monthsRoutes);
app.use(landingRoutes);

//connecting to the mongo database
MongoClient.connect("mongodb://localhost:27017",{ useUnifiedTopology: true }, function(err, client) {
    if(!err) {
        console.log("We are connected");
    }
    db=client.db("bucketList");
    //creates collection variable to use in routes
    entriesCollection=db.collection("Entries_Collection");
    goalsCollection=db.collection("Goals_Collection");
    app.listen(3000,function(){
        console.log("Server running on port 3000");
    });
});

