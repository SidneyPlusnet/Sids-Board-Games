const express = require("express");

const {getCategories, getReviews, getReviewId, getCommentsByReviewId, postComment, patchReview, getUsers}= require("./controllers/games");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewId)
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId)
app.post("/api/reviews/:review_id/comments", postComment)
app.patch("/api/reviews/:review_id", patchReview)
app.get("/api/users", getUsers)


app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }else 
  next(err);

})

app.use((err, req, res, next) => {
  if (err.code === '22P02' || err.code === '23502' || err.code === '42601') {
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
    res.status(500).send({ msg: 'Internal Server Error' });
  });

module.exports = app;