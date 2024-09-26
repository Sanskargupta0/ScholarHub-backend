const { Schema, model} = require("mongoose");

const contactSchema = new Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
    },
    email:{
        type: String,
        required: [true, "Email is required"],
    },
    phone:{
        type: Number
    },
    message:{
        type: String,
        required: [true, "Message is required"],
    },
    date:{
        type: Date,
        default: Date.now,
    }
});


const Contact = model("Contact", contactSchema);

module.exports = Contact;