const mongoose=require('mongoose')
const Schema=mongoose.Schema; // schema is used to define the structure of document data

//defining the schema
const personSchema=new Schema(
    {
        name:{
            type:String,
            required:true
        },
        age:Number,
        favoriteFoods : [String]
    }
)

//defining the model

const Person=mongoose.model('Person',personSchema)
module.exports=Person;