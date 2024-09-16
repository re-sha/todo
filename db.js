const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
    name: String,
    email : { type: String, require: true, index:true, unique:true,sparse:true},
    password: String
});

const Todo = new Schema({
    title: String,
    done: Boolean,
    userId: ObjectId,
    description: String
});

const UserModel = mongoose.model('users', User); //users = collection, User = schema
const TodoModel = mongoose.model('todos', Todo);

module.exports = {
    UserModel,
    TodoModel
}