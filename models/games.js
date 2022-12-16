const db = require("../db/connection");

exports.selectCategories = () =>{
return db
.query("SELECT * FROM categories;")
.then(({rows})=>{
return rows
})
}

exports.selectReviews = (category, sort_by = 'created_at', order_by = 'DESC') =>{
    const validSortBy = ['review_id', 'votes', 'created_at']
    const validCategories = [ 'euro game', 'social deduction', 'dexterity',"children's games" ]

if(!validSortBy.includes(sort_by)){
    return Promise.reject({status: 400, msg: 'Bad Request'})
}

    const queryValues = []

    let queryString = `SELECT owner,title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, count(comments.review_id) as comment_count FROM reviews left join comments on (reviews.review_id = comments.review_id)`

if(category !== undefined){
queryString += ` WHERE reviews.category = $1 `;
queryValues.push(category)
}



queryString += `group by reviews.review_id ORDER BY ${sort_by} ${order_by};`;



    return db
    .query(queryString, queryValues)
    .then(({rows})=>{

        if(rows.length === 0 && !validCategories.includes(category)){
            return Promise.reject({
                status: 404,
                msg: 'Not a category'
    
            })
        }
        return rows
    })
}

exports.selectReviewId = (review_id) => {
return db
.query("SELECT reviews.*, (SELECT COUNT(*) FROM comments WHERE comments.review_id = reviews.review_id) AS comment_count from reviews WHERE review_id = $1;", [review_id])
.then(({rows}) => {   
    const review = rows[0] 
    if(!review){
        return Promise.reject({
            status: 404,
            msg: 'No review with that id'

        })
    }

        review.comment_count=   Number(review.comment_count)

   return review});
}

exports.selectCommentsByReviewId = (review_id) =>{
    return db
    .query("SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;", [review_id])
    .then(({rows}) => {

   
        return rows
   });
}

exports.insertComment = (comment ,review_id) => {

if(comment.username === undefined || comment.body === undefined ){
    return Promise.reject({
        status: 400,
        msg: 'Bad Request'
    })
}

return db
.query(`INSERT INTO comments (author, body, votes, review_id) VALUES ($1, $2, $3, $4) RETURNING *;`, [comment.username, comment.body, 0, review_id])
.then(({rows: comment})=>{

    
 
return comment[0]
})
}

exports.updateReview = (review, review_id) =>{
    if(review.inc_votes === undefined){
        return Promise.reject({
            status: 400,
            msg: 'Bad Request'
        })
    }

    return db.
    query(`UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`, [review.inc_votes, review_id])
    .then(({rows: review})=>{
       
        return review[0]
    })
    
    }
  

    exports.selectUsers =() =>{
    return db
    .query(`SELECT * FROM users;`).then(({rows:users})=>{
    
    return users
    
    })
    
    }

