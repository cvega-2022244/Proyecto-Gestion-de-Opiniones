'use strict'

import express from 'express'

import{
    test,
    register,
    login,
    update,
    updatePassword
}from './user.controller.js'

import { validateJwt } from '../middleware/validate-jwt.js'

const api = express.Router()

api.get('/test', test)
api.post('/register', register)
api.post('/login', login)
api.put('/update/:id',[validateJwt] , update)
api.put('/updatePassword/:id',[validateJwt], updatePassword) 

export default api