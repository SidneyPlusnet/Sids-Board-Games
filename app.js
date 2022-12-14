const express = require("express");

const {getCategories, getReviews, getReviewId, postComment}= require("./controllers/games");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewId)
app.post("/api/reviews/:review_id/comments", postComment)

  app.all('*', (req, res, next)=>{
res.status(404).send({msg: 'path not found'})

  })

  app.use((err, req, res, next) => {
    console.log(err, " 500 error");
    res.status(500).send({ msg: 'Internal Server Error' });
  });

module.exports = app;