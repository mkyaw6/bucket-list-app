const express=require('express');
const router= express.Router({mergeParams: true});
const ObjectId = require('mongodb').ObjectId;

//FUNCTION WHICH RETURNS A FORMATTED DATE STRING
function getDateString(day,month,year){
    if(day.length===1){
        day="0"+day;
    };
    if(month.length===1){
        month="0"+month;
    };
    var dateString= year+"-"+month+'-'+day;
    return dateString
}
//NEW ENTRY POSTROUTE
router.post("/months/:goalId/:year/:month/:day",function(req,res){
    var date= req.body.date;
    var progress= req.body.progress;            
    var hours= req.body.hours;
    var year=req.params.year;
    var month=req.params.month;
    var day=req.params.day;
    var goalId=req.params.goalId;
    entriesCollection.insertOne({date: date, progress: progress, hours: hours, goalId:goalId,}, function(err,db){
        if(!err){console.log('added');}  
    });
    res.redirect("/months/"+goalId+"/"+year+"/"+month+"/"+day);
});

//GET ROUTE FOR INDEX OF EACH DAY
router.get("/months/:goalId/:year/:month/:day", function(req,res){
    var dateString=getDateString(req.params.day,req.params.month,req.params.year);
    var year=Number(req.params.year);
    var month=Number(req.params.month);
    var day=Number(req.params.day);
    var goalId=req.params.goalId;
    entriesCollection.find({date:dateString,  goalId:goalId}).toArray(function(err, entries) {
        if(err){console.log("Not Found")};
        res.render('days.ejs',{entries: entries, year:year, month:month, day:day, goalId:goalId,});
    }); 
})

//GET ROUTE FOR ADDING NEW ENTRY
router.get("/months/:goalId/:year/:month/:day/new", function(req,res){
    var year=req.params.year;
    var month=req.params.month;
    var day=req.params.day;
    var goalId=req.params.goalId;
    var dateString=getDateString(req.params.day,req.params.month,req.params.year);
    res.render("new.ejs",{year:year, month:month, day:day, goalId:goalId, dateString:dateString});
});

//GET ROUTE FOR EDITING ENTRY
router.get("/months/:goalId/:year/:month/:day/:_id/edit", function(req,res){
    var id= ObjectId(req.params._id);
    var year=req.params.year;
    var month=req.params.month;
    var day=req.params.day;
    var goalId=req.params.goalId;
    entriesCollection.findOne({_id:id},function(err,entry){
        if(err){console.log("Entry not found")};
        res.render("edit.ejs", {entry:entry, year:year, month:month, day:day, goalId:goalId,});
    });
});

//EDIT PUT ROUTE
router.put("/months/:goalId/:year/:month/:day/:_id", function(req,res){
    var id= ObjectId(req.params._id);
    var date= req.body.date;
    var progress= req.body.progress;
    var hours= req.body.hours;
    var year=req.params.year;
    var month=req.params.month;
    var day=req.params.day;
    var goalId=req.params.goalId;
    entriesCollection.findOneAndUpdate({_id:id},{$set:{date: date, progress: progress, hours: hours}},function(err,entry){
        if(err){console.log("Couldn't Update")};
        res.redirect("/months/"+goalId+"/"+year+"/"+month+"/"+day);
    });
});

//DELETE ROUTE
router.delete("/months/:goalId/:year/:month/:day/:_id",function(req,res){
    var id= ObjectId(req.params._id);
    var year=req.params.year;
    var month=req.params.month;
    var day=req.params.day;
    var goalId=req.params.goalId;
    entriesCollection.findOneAndDelete({_id:id},function(err,entry){
        if(err){console.log("Couldn't Delete")};
        res.redirect("/months/"+goalId+"/"+year+"/"+month+"/"+day);
    });
});

module.exports=router;