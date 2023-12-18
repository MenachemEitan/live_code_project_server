const { MongoClient } = require('mongodb');
require('dotenv').config()
const mongo_uri =  "mongodb+srv://menahemEitan:Qpmz13798264@patadoption.7a2vlju.mongodb.net/?retryWrites=true&w=majority"


// const mongo_uri = process.env.MONGO_URI
let live_code = {}
console.log("mongo_uri ", mongo_uri)

MongoClient.connect(mongo_uri, { useUnifiedTopology: true }).then((client, err) => {
    if(err){
        console.log("unable to connect to db ");
        return
    }
    else{ console.log("monog connect");
    live_code = client.db('live_code')} 
   


});




module.exports = {
    mongo_collection :(name)=>{
        return live_code.collection(name)
    }

}
