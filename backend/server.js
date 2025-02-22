require('dotenv').config();
const express = require('express');
const app = express();
const port = 5000;
const cors = require("cors");

const db = require("./db");


app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
