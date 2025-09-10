import mongoose from "mongoose";

declare global {
    var _mongoose: {isConnected?: number };
}

const connection = global._mongoose || { isConnected: 0 }; //for prevent database chopping(overloaded connections).

const dbConnection = async (): Promise<void> => {
    if(connection.isConnected) {
        console.log("Already connected to database");
        return;
    }
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
    }
    try{
        const db = await mongoose.connect(process.env.DATABASE_URL);
        connection.isConnected = db.connections[0].readyState;
        if(process.env.NODE_ENV !== "production"){
            global._mongoose = connection; //for prevent database chopping(overloaded connections).
        }
        console.log("Connected to database");
    }
    catch(err) {
        console.log("Error connecting to database", err);
        process.exit(1); //exit the process with failure
    }
}

export default dbConnection;




// 1️⃣ The problem we are solving
// In Next.js, especially in development mode:
// Files are reloaded multiple times (hot reload).
// Each reload runs your code again, including your dbConnect() function.
// If we create a new Mongoose connection every reload, MongoDB will get multiple connections → error or slowdown.
// We need a way to remember that a connection already exists across reloads.

// 2️⃣ Why global?
// JavaScript/Node has a special object called global (like window in browsers).
// Anything you attach to global stays in memory as long as the Node process is running.
// So if we store our connection state on global, it survives hot reloads.

// 3️⃣ What declare global { var _mongoose: {...} } does
// This is TypeScript syntax.
// By default, TypeScript doesn’t know _mongoose exists on global.
// declare global tells TypeScript:
// “Hey TS, I promise there is a variable _mongoose on global and it has this shape.”

// In our code:
// var _mongoose: { isConnected?: number };
// means _mongoose is an object that may have an isConnected number property (0, 1, 2…).
// Without this, TS would throw an error:
// Property '_mongoose' does not exist on type 'Global'

// 4️⃣ Why we do global._mongoose = connection
// global._mongoose = connection;
// After connecting the first time, we save our connection object to the global variable.
// Next time the file reloads (hot reload), we can check:
// const connection = global._mongoose || { isConnected: 0 };


// ✅ If it exists, we reuse the connection instead of creating a new one.
// This is the core trick to prevent multiple database connections in Next.js dev mode.