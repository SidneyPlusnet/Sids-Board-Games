const db = require("../db/connection");

exports.selectCategories = () =>{
return db
.query("SELECT * FROM categories;")
.then(({rows})=>{
return rows
})
}

exports.selectReviews = () =>{
    return db
    .query("SELECT owner,title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, count(comments.review_id) as comment_count from reviews left join comments on (reviews.review_id = comments.review_id)group by reviews.review_id  ORDER BY created_at DESC;")
    .then(({rows})=>{
        return rows
    })
}

exports.selectReviewId = (review_id) => {
return db
.query("SELECT * FROM reviews WHERE review_id = $1;", [review_id])
.then(({rows}) => {   
    const review = rows[0] 
    if(!review){
        return Promise.reject({
            status: 404,
            msg: 'No review with that id'

        })
    }
   return review});
}

exports.selectCommentsByReviewId = (review_id) =>{
    return db
    .query("SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;", [review_id])
    .then(({rows}) => {
        if(!rows.length){
            return Promise.reject({
                status: 404,
                msg: 'No comments with that review id'
            })
        }  
        return rows
   });
}

exports.insertComment = (comment ,review_id) => {
    console.log("model")
    console.log(review_id, "review id")
    console.log(comment, "comment")
return db
.query(`INSERT INTO comments (author, body, votes, review_id) VALUES ($1, $2, $3, $4) RETURNING *;`, [comment.username, comment.body, 0, review_id])
.then(({rows: comment})=>{

return comment[0]
})
// need to find a way to include review ID, which i think should be request. params
}
