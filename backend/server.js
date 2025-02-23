const express = require('express');
const app = express();
const port = 5000;
const cors = require("cors");

const db = require("./db");


const usuarioRoutes = require("./routes/usuarioRoutes");
const idiomaRoutes = require("./routes/idiomaRoutes");
const interesseRoutes = require("./routes/interesseRoutes");
const matchRoutes = require("./routes/matchRoutes");

app.use(cors(
    //origin: "http://localhost:3000", // Permite apenas o frontend acessar
));

app.use("/usuario", usuarioRoutes);
app.use("/idioma", idiomaRoutes);
app.use("/interesse", interesseRoutes);
app.use("/match", matchRoutes);


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
