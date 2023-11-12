import 'dotenv/config'; // Do not standardize, this fixes bug https://stackoverflow.com/questions/62287709/environment-variable-with-dotenv-and-typescript
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import session from 'express-session';
import { sequelize } from './db/dbConfig';
import router from './router';
import cookieParser from 'cookie-parser';
import { initAdminProfile } from './utils/initAdmin';

const MongoDBStore = require('connect-mongodb-session')(session);
const MONGO_URL = "mongodb+srv://peerprep15:CRFVdZNswqisruzv@peerprep.vmiy632.mongodb.net/?retryWrites=true&w=majority";
const app = express();

const store = new MongoDBStore({
    uri: MONGO_URL,
    collection: 'sessions',
});

app.use(compression());
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
    },
    store: store,
}));

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));

const server = http.createServer(app);
const port = 5000;

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// Initialize sequelize instance
(async () => {
    try {
        await sequelize.sync();
        console.log('Database synchronized!');
        initAdminProfile();
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
})();

app.use('/', router());
