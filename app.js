import express from "express";
import mongoose from 'mongoose'
import dotenv from "dotenv"
import { graphqlHTTP } from "express-graphql";
import schema from './schema/schema.js';
import isAuth from './Middleware/Auth.js'

const app = express();

dotenv.config()
mongoose.connect(process.env.DVENT_DB_URI, {useNewUrlParser: true})
mongoose.connection.once('open', () => {
    console.log('connected to database')
})

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true 
}));

app.listen(4000, () => {
    console.log('app listening at port 4000')
});