const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userScehma = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'A user must have a first name']
    },
    lastName: {
        type: String,
        required: [true, 'A user must have a last name']
    },
    email: {
        type: String,
        required: [true, 'Email Id is required!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email!']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please enter a password!'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your passoword!'],
        validate: {
            validator: function(val) {
                return this.password === val
            },
            message: 'Passwords are not matching!!'
        }
    },
});


userScehma.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User', userScehma);

module.exports = User;