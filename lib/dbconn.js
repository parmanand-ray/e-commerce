import mongoose from "mongoose"

const mongo_url = process.env.MONGO_URI;

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {
        conn : null,
        promise : null,
    }
}

export const connectDB = async () => {
    if(cached.conn) return cached.conn;

    if(!cached.promise){
        cached.promise = mongoose.connect(mongo_url,{
            dbName:'ecommerce',
            bufferCommands:false
        })
    }

    cached.conn = await cached.promise;

    return cached.conn;
}