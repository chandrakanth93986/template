import express from 'express'
const userRoute = express.Router()
import User from '../models/User.js'
import expressAsyncHandler from 'express-async-handler'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

userRoute.post("/register", expressAsyncHandler(async (req, res) => {
    try {
        // check if the user exists and create if doesnot exists
        const userData = await req.body;
        const { email, password } = userData;
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User exists!" })
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        userData.password = hashedPassword

        const newUser = await User(userData);
        await newUser.save()

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        // res.cookie("auth_token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     maxAge: 86400000
        // })

        return res.status(201).json({ message: "User Created Successfully!", newUser })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "User creation failed!" })
    }
}))

userRoute.get("/profile/:email", expressAsyncHandler(async (req, res) => {
    try {
        const email = req.params.email
        const user = await User.findOne({ email })
        console.log(email);
        if (!user) {
            return res.status(404).json({ message: "User not found!" })
        }

        return res.status(200).json({ message: "User found!", user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something went wrong!" })
    }
}))

userRoute.put("/update", expressAsyncHandler(async (req, res) => {
    try {
        const { email,username, address, avatar } = await req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found!" })
        }
        user.username = username
        user.address = address
        user.avatar = avatar
        await user.save()

        return res.status(200).json({ message: "User updated successfully!", user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something went wrong!" })
    }
}))

export default userRoute