const express = require("express");

const {getCategories, getReviews, getReviewId, getCommentsByReviewId}= require("./controllers/games");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewId)
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId)

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }else 
  next(err);

})

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else next(err);
});

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
  });

  app.all('*', (req, res, next)=>{
res.status(404).send({msg: 'path not found'})

  })

  app.use((err, req, res, next) => {
    console.log(err, " 500 error");
    res.status(500).send({ msg: 'Internal Server Error' });
  });

module.exports = app;