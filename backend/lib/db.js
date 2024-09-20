import mongoose from "mongoose"
export const connectDb= async ()=>{
    try {
       const conn= await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDb connected: ${conn.connection.host}`)	

    }catch(err){
        console.log(`Error connecting to db: ${err.message}`)
        process.exit(1)
    }
   
}