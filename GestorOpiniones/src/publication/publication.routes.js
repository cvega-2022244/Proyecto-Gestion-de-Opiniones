'use strict'

import express from 'express'

import {
    createPost, deletePost, getPosts, updatePost
}from './publication.controller.js'

import { validateJwt } from '../middleware/validate-jwt.js'

const api = express.Router()

api.post('/createPost', [validateJwt], createPost )
api.get('/getPosts', [validateJwt], getPosts)
api.put('/updatePost/:id', [validateJwt], updatePost )
api.delete('/deletePost/:id', [validateJwt], deletePost)
export default api