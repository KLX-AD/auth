require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
       email: String ,
       password: String
});
const secret = process.env.SECRET_1;

userSchema.plugin(encrypt , { secret:secret , encryptedFields: ['password'] });

const User = mongoose.model("User" , userSchema);

app.get("/",function(req , res){
    res.render("home");
});

app.get("/login",function(req , res){
    res.render("login");
});

app.get("/register",function(req , res){
    res.render("register");
});

app.post("/register",function(req , res){
    const newUser ={
        email: req.body.username ,
        password: req.body.password
    }
    User.create(newUser,function(err){
        if (!err){
            console.log("User has been created .");
            // res.redirect("/login");
            res.render("secrets");
        }else{
            console.log(err);
        }
    })
});

app.post("/login",function(req , res){
    User.findOne({
        email : req.body.username 
        
    } , function(err , foundUser){
        if(!err){
            if( foundUser){
                if( foundUser.password === req.body.password){
                    console.log("Credentials are correct");
                    res.render("secrets");
                }else{
                    console.log("Wrong password");
                    res.redirect("/login");

                }
            }else{
            console.log("user not found please log in");
            
            }
        }
    })
})



app.listen(3000,function(){
    console.log("Server Up and running on port 3000")
});

