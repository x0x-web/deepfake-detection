import mongoose from "mongoose";

const dbConnection = async () => {
    console.log("yes")
    console.log(process.env.DB_URI)

    await mongoose.connect(process.env.DB_URI).then(() => {
        console.log("db connected successfuly")
    })
}

export default dbConnection