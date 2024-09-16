const express = require("express")
const { UserModel, TodoModel } = require("./db");
const { auth, JWT_SECRET } = require("./auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const {z} = require("zod")

async function connectToDB() {
    try{
        const response = await mongoose.connect("")
        if(response)
            console.log("Successfully connected to DB")    
    }
    catch(e) {
        console.log("Could not connect to database due to ", e)
    }
}
connectToDB();

const app = express();
app.use(express.json()); //while passing body in post this is required to be able to read the request/response 

app.post("/signup", async function(req,res){
    //zod input validation
    // const req.body = z.object({
    //     name: z.string().min(5),
    //     email: z.string().email(),
    //     password:z.string().min(6).max(14)
    // })


    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // const hashedPassword = await bcrypt.hash(password, 5)
    // console.log(hashedPassword);

    try {
        await UserModel.create({
            name: name,
            email: email,
            password: password
        });
        res.json({
            msg: "Successfuly signed up"
        })
    }
    catch(error) {
        console.log("Error creating account", error);
        return res.json({
            msg: "Could not create account",
            error: error.message
        })
    }
});

app.post("/signin", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email: email,
    })
    if(!response) {
        res.json("User does not exist")
    }

    const thePassword = bcrypt.compare(password, response.password);
    if (response) {
        const token = jwt.sign({
            id: response._id
        }, JWT_SECRET);
        res.json({token})
    }
    else {
        res.status(403).json({
            msg: "Login unsuccessful"
        })
    }
});

//middleware but separate logic to another file

app.post("/todo", auth, async function(req,res){  //TODO: auth
    {
        const userId = req.userId;
        const title = req.body.title;
        const done = req.body.done;
        const description = req.body.description;

        try{
            await TodoModel.create({
                userId: userId,
                done: done,
                title: title,
                description: description
            })
            res.json("Created todo successfully")
        }
        catch(error){
            res.status(403).json("Could not create todo")
        }
    }
});

app.get("/todos", auth, async function(req,res){ //TODO: auth
    const userId = req.userId;
    const todos = await TodoModel.find({
        userId
    })
    res.json({
        todos
    })
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});