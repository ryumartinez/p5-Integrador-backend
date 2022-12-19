const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser");

const app = express()

const PORT = process.env.PORT || 3500

app.use(cors())
app.use(express.json());
app.use(cookieParser());

app.use('/users', require('./routes/userRoutes.js'))


app.listen(PORT,() => {
  console.log(`escuchando en el puerto ${PORT}`)
})