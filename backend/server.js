require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const articleRoutes = require('./routes/articles')

const app = express();

//middleware
app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
    console.log(req.url, req.method)
    next();
})

//routes
app.use('/articles', articleRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Connected to DB & Listening on port 3000");
        })
    })
    .catch((error) => {
        console.log(error)
    }
    )


