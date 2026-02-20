import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import courseRouter from './routes/courseRoute.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);



const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('Hello New World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})