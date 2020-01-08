const express=require('express');
const router= express.Router({mergeParams: true});
const ObjectId = require('mongodb').ObjectId;

router.get("/", function(req,res){
    goalsCollection.find({}).toArray(function(err, goalsArr) {
        if(err){console.log("Not Found")}
        res.render('landing.ejs', {goalsArr:goalsArr});
    });
    
});

router.post("/", function(req,res){
    var goal=req.body.goal;
    goalsCollection.insertOne({goal:goal}, function(err,doc){
        if(!err){console.log('added');}  
    });
    res.redirect("/");
})

router.delete("/:goalId", function(req,res){
    var goalId=req.params.goalId;
    //deletes all entries with the specified goalId from entriesCollection
    entriesCollection.deleteMany({goalId:goalId},function(err,entry){
        if(err){console.log("Couldn't Delete")};
    });
    //deletes all goals with the specified goalId from goalsCollection
    goalsCollection.deleteOne({_id:ObjectId(goalId)},function(err,entry){
        if(err){console.log("Couldn't Delete")};
        console.log("Goal Deleted");
    });
    res.redirect("/");
});


module.exports=router;