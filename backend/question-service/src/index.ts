import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './router'
import session from 'express-session';

const MongoDBStore = require('connect-mongodb-session')(session);
const MONGO_URL = "mongodb+srv://peerprep15:CRFVdZNswqisruzv@peerprep.vmiy632.mongodb.net/?retryWrites=true&w=majority";

dotenv.config();
const app = express();

const store = new MongoDBStore({
    uri: MONGO_URL,
    collection: 'sessions',
});

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store,
}));

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));

app.use(compression());
app.use(bodyParser.json());

const server = http.createServer(app);
const port = process.env.PORT || 8080;

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (e) => {
    console.log('MongoDB connection error.');
    console.log(e);
    process.exit();
});

app.use('/', router());