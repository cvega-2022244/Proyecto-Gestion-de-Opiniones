'use strict'

import {Schema, model} from 'mongoose'

const publicationSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    comment:{
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})

export default model('publication', publicationSchema) 