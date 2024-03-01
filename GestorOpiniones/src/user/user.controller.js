'use strict'


import User from '../user/user.model.js'
import jwt from 'jsonwebtoken'

import bcrypt from 'bcrypt';
const { compare } = bcrypt;

import { generateJwt } from '../utils/jwt.js'

import {
    encrypt,
    checkPassword,
    checkUpdate
} from '../utils/validator.js'


export const test = async (req, res) => {
    return res.send('Hello World ')
}



export const register = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let user = await User(data)
        await user.save()
        return res.status(200).send({
            message: 'User registered successfully.'
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user' })
    }
}



export const login = async (req, res) => {
    try {
        let { username, email, password } = req.body
        if (!username && !email) return res.status(400).send({ message: 'We need your username or email to login.' })

        let user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })

        if (!user) return res.status(404).send({ message: 'User not found' })
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error logging in' })
    }
}


export const update = async (req, res) => {
    try {
        let { id } = req.params
        let { _id } = req.user
        let data = req.body
        if(id !=_id) return res.status(401).send({message: 'You do not have permission to update another user.'})
        if(data.password != null) return res.status(400).send({message:'You cannot update the password here'})
        let update = checkUpdate(data, _id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be update or missing' })
        let udpatedUser = await User.updateOne(
            { _id: _id },
            data,
            { new: true }
        )
        if (!udpatedUser) return res.status(404).send({ message: 'User not found' })
        return res.status(200).send({ message: 'User updated successfully.' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating the user' })
    }
}


export const updatePassword = async (req, res) => {
    try {
        let { id } = req.params
        let { _id } = req.user
        let data = req.body
        if(id !=_id) return res.status(401).send({message: 'You do not have permission to update another user.'})
        if (data.name != null || data.surname != null || data.email != null || data.phone != null || data.address != null)
            return res.status(400).send({ message: 'You can only change your password' })
        let userFound = await User.findOne({ _id })
        console.log(userFound)

        const isLastPasswordCorrect = await bcrypt.compare(data.lastPassword, userFound.password);

        //Validating the last and new password
        if (isLastPasswordCorrect) {
            //Encrypting the password
            data.password = await encrypt(data.password)
            let update = checkUpdate(data, _id)
            if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be update or missing' })

            //Updating the user
            let udpatedUser = await User.updateOne(
                { _id: _id },
                data,
                { new: true }
            )

            if (!udpatedUser) return res.status(404).send({ message: 'User not found' })

            return res.status(200).send({ message: 'User updated successfully.' })
        }else{
            return res.status(400).send({ message: 'Your last password is not correct.' });
        }

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating the user' })
    }
}
