const express = require("express");

const {getCategories, getReviews, getReviewId, getCommentsByReviewId, postComment}= require("./controllers/games");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewId)
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId)
app.post("/api/reviews/:review_id/comments", postComment)

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
  if ( err.code === "23503") {
    res.status(404).send({ msg: 'Bad Request' });
  } else next(err);
});


  app.all('*', (req, res, next)=>{
res.status(404).send({msg: 'path not found'})

  })

  app.use((err, req, res, next) => {
    console.log(err, " 500 error");
    res.status(500).send({ msg: 'Internal Server Error' });
  });

module.exports = app;