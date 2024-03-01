// Importación de módulos 
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'

import userRoutes from '../src/user/user.routes.js'
import publicationRoutes from '../src/publication/publication.routes.js'
import commentRoutes from '../src/comment/comment.routes.js'

const app = express()
config()

// Configuración del puerto
const port = process.env.PORT || 3056

// Configuración de middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.use('/user', userRoutes)
app.use('/publication', publicationRoutes)
app.use('/comment', commentRoutes)

export const initServer = () => {
    app.listen(port)
    console.log(`Server HTTP running on port ${port}`)
}
