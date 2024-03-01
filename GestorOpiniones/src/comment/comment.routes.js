'use strict'

import {
    validateJwt
} from '../middleware/validate-jwt.js'

import express from 'express'

import {
    test,
     createComment, 
     deleteComment, 
     getComments, 
     getMyComments, 
      updateComment 
} from './comment.controller.js'

const api = express.Router()

api.get('/test', test)
 api.post('/createComment', [validateJwt], createComment)
api.get('/getComments', [validateJwt], getComments)
api.get('/getMyComments', [validateJwt], getMyComments)
api.put('/updateComment/:id', [validateJwt], updateComment)
api.delete('/deleteComment/:id', [validateJwt], deleteComment) 

export default api 