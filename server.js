const express=require('express')
const app=express()
const mongoose=require('mongoose')
const Person=require('./models/person')

//connect to atlas database
const dbURI="mongodb+srv://oumaya:ouma333@cluster3.vo2r8gw.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(dbURI,{useNewUrlParser: true , useUnifiedTopology: true }, { useFindAndModify: false })
.then((response)=>{
    app.listen(3000,(err)=>{
        (err)?console.log("server not running",err):console.log("server running successfully")
    })
    
    })
.catch((err)=>{console.log("connection to database failed",err)})


//create and save one document
app.get("/add",(req,res)=>{
//creating a first instance of Person model
const person1=new Person({
    name:"jihen",
    age:24,
    favoriteFoods :['pizza','salad','lasagna']
})
//saving person1 to mongoDB atlas
person1.save((err)=>{
(err)?console.log("error while saving",err):console.log("saved successfully")
})
})

//create and save multiple people ( multiple instance of model) : this method triggers save automatically
app.get('/add_many',(req,res)=>{
    Person.create([
        {name:"Eya",
        age:14,
        favoriteFoods :['couscous','fruits','lasagna','poisson']},
        {name:"ahmed",
        age:28,
        favoriteFoods :['pizza','salad']},
        {name:"mostfa",
        age:18,
        favoriteFoods :['chicken wings']},
        {name:"samar",
        age:35,
        favoriteFoods :['pizza','spaghetti','riz']}
    ])
        
})

//search by name 
let name="mostfa"
app.get('/search',(req,res)=>{
    Person.find({"name":name}).then((result)=>{
        res.send(result)
    })
    .catch((err)=>{console.log("error occured while searching",err)})
})
//search findOne
app.get('/findOne',(req,res)=>{
    Person.findOne({"favoriteFoods":{$in : ["chicken wings","spaghetti"]}})
    .then((result)=>{
        res.send(result)
    })
    .catch((err)=>{console.log("error occured while searching",err)})
})

//findById
let id="5f7fd6f9ae24612cece2466a"
app.get('/findById',(req,res)=>{
    Person.findById(id, function (err, doc) { 
        if (err){ 
            console.log(err); 
        } 
        else{ 
            console.log("Result : ", doc); 
        } 
    }); 
})

//Perform Classic Updates by Running Find, Edit, then Save

const personId="5f7fd6f9ae24612cece2466a"
app.get("/update",(req,res)=>{
    Person.findById(personId,(err,personFound)=>{
    if(err){
        console.log("error while searching",err)
    } 
    else{
        personFound.favoriteFoods.push('burrito');
        personFound.save()
        .then(response=>{console.log("person saved successfully",personFound)})
        .catch(err=>console.log("error occured while saving",err))
    }
    
    })

})

//Perform New Updates on a Document Using model.findOneAndUpdate()
const personName="samar"
app.get("/findOneAndUpdate",(req,res)=>{
    Person.findOneAndUpdate({"name":personName},{"age":20},{new:true},(err,personUpdated)=>{
        (err)?console.log("error while updating",err):console.log("the new updated person :",personUpdated)
    })
})

//Delete One Document Using model.findByIdAndRemove
const personId2="5f7fd6f9ae24612cece24669"
app.get('/findByIdAndRemove',(req,res)=>{
    Person.findByIdAndRemove(personId2,(err,deletedPerson)=>{
        (err)?console.log("error occured while deleting"):console.log("this object is deleted with succes",deletedPerson)
    })
})

//Chain Search Query Helpers to Narrow Search Results
app.get('/LikeBurrito',(req,res)=>{
    Person.find({"favoriteFoods":{$in:"burrito"}}).sort('name').limit(2).select('-age').exec((err,data)=>{
    (err)?console.log("error while looking for people who like burrito",err):console.log("people who like burrito",data)
    })
})
//MongoDB and Mongoose - Delete Many Documents with model.remove()
app.get('/deleteAllMary',(req,res)=>{
    Person.remove({"name":"Mary"},(err,result)=>{
        (err)?console.log("error while deleting"):console.log("deleted successfully",result)
    })
})