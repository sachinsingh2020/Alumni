import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your first name"],
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: validator.isEmail,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password must be at least 6 characters"],
        select: false,
    },
    role: {
        type: String,
        required: [true, "Please enter your role"],
    },
    profilePic: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    graduationYear: {
        type: String,
        required: [true, "Please enter your graduation year"],
    },
    phoneNumber: {
        type: String,
        required: [true, "Please enter your phone number"],
    },
    course: {
        type: String,
        required: [true, "Please enter your course"],
    },
    branch: {
        type: String,
        required: [true, "Please enter your branch"],
    },
    address: {
        type: String,
        required: [true, "Please enter your address"],
    },
    rollNumber: {
        type: String,
        required: [true, "Please enter your roll number"],
    },
    dateOfBirth: {
        type: String,
        required: [true, "Please enter your date of birth"],
    },
    linkedin: {
        type: String,
        required: [true, "Please enter your linkedin profile"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: String,
})

schema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
})

schema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

schema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

schema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

export const User = mongoose.model('User', schema);