const express = require("express");

const {getCategories, getReviews, getReviewId}= require("./controllers/games");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewId)



  app.use((err, req, res, next) => {
    if (err.code === '22P02') {
      console.log(err, "22P02 error");
      res.status(400).send({ msg: 'Bad Request' });
    }  else next(err);
  });

app.use((err, req, res, next) => {
    console.log(err, " 500 error");
    res.status(500).send({ msg: 'Internal Server Error' });
  });

  app.all('*', (req, res, next)=>{
res.status(404).send({msg: 'path not found'})

  })

module.exports = app;