const express = require("express");

const {getCategories, getReviews}= require("./controllers/games");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  });

  app.all('*', (req, res, next)=>{
res.status(404).send({msg: 'path not found'})

  })

module.exports = app;