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