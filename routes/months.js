const express=require('express');
const router=express.Router({mergeParams: true});
const ObjectId = require('mongodb').ObjectId;

//function which generates an array of days in specified year and month
var getDaysInMonth= function(year,month){
    //creates a date object on the last day of each month. Month is base 1, i.e. January == 1
    var lastDayObj= new Date(year,month,0);
    //returns the last day of the month:
    var lastDay=lastDayObj.getDate();
    daysArr=[];
    for(var i=1; i<=lastDay; i++){
        iString=i.toString();
        if(iString.length===1){
            iString="0"+iString;
        }
        daysArr.push(iString);
    }
    return daysArr
}
router.get("/months/:goalId",function(req,res){
    var today= new Date();
    var todayDay= today.getDate();
    var todayMonth= today.getMonth()+1;
    var todayYear= today.getFullYear();
    var goalId=req.params.goalId;
    res.redirect("/months/"+goalId+"/"+todayYear+"/"+todayMonth);
});

//get route for specified month
router.get("/months/:goalId/:year/:month", function(req,res){
    var goalId=req.params.goalId;
    var year=Number(req.params.year);
    var month=Number(req.params.month);
    if(req.params.month.length===1){
        req.params.month="0"+req.params.month;
    };
    var yearStr=req.params.year
    var monthStr= req.params.month;
    goalsCollection.findOne({_id:ObjectId(goalId)}, function(err,goal){
        goalStr= goal.goal;
    });
    goalsCollection.find({}).toArray(function(err, docs) {
        if(err){console.log("Not Found")}
        goalsArr= docs;
    });
    entriesCollection.find({date:{$regex:yearStr+"-"+monthStr+"-"}, goalId:goalId}).toArray(function(err, docs) {
        if(err){console.log("Not Found")};
        //Constructs an array of days of each entry in current month
        var entryArr=[];
        docs.forEach(function(doc){
            var dateString=doc.date;
            entryArr.push(dateString.substr(dateString.length-2,2));
        });
        res.render('months.ejs', {month:month,year:year, entryArr:entryArr, goalId:goalId, goalStr:goalStr, goalsArr:goalsArr, getDaysInMonth:getDaysInMonth});
        });    
    }); 

module.exports=router;

