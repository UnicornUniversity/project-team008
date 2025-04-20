import express from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import { sequelize } from './config/database'
import { authenticateToken } from './middlewares/authenticateToken.middleware'
import { isAdmin } from './middlewares/isAdmin.middleware'

import authRouter from './components/Auth/auth.routes'
import userRouter from './components/User/user.routes'
import fileRouter from './components/File/file.routes'
import downloadRouter from './components/Download/download.routes'
import fileAccessRouter from './components/FileAccess/fileAccess.routes'
import arduinoRouter from './components/ArduinoConfig/arduino.routes'

const app = express()
app.use(cors())
app.use(json())

// Public auth endpoints
app.use('/auth', authRouter)

// Protected endpoints
app.use(authenticateToken)
app.use('/file', fileRouter)
app.use('/download', downloadRouter)
app.use('/file/:id/user', fileAccessRouter)

// User and Arduino are admin-guarded for non-GET ops
app.use('/user', isAdmin, userRouter)
app.use('/arduino', isAdmin, arduinoRouter)

export default app
