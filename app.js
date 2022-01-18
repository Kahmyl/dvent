import express from "express";
import mongoose from 'mongoose'
import dotenv from "dotenv"
import { graphqlHTTP } from "express-graphql";
import schema from './schema/schema.js';
import isAuth from './Middleware/Auth.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
    credentials:true,
    // origin:'http://localhost:3000'
    origin:'https://dvents.vercel.app'
}))

app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
})

app.use(cookieParser());

const port = process.env.PORT || 4000

dotenv.config()
mongoose.connect(process.env.DVENT_DB_URI, {useNewUrlParser: true})
mongoose.connection.once('open', () => {
    console.log('connected to database')
})

app.get('/', function (req, res) {
    res.send('hello world')
})

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true 
}));

app.listen(port, () => {
    console.log('app listening at port'+ port)
});