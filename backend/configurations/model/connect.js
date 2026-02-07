import mongoose  from "mongoose";

const dbConnection =  async () =>{
    await mongoose.connect(process.env.DB_URI).then(()=>{
        console.log("db connected successfuly")
    })
}

export default dbConnection