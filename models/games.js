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
    .query("SELECT reviews.*, count(comments.review_id) as comment_count from reviews left join comments on (reviews.review_id = comments.review_id)group by reviews.review_id ORDER BY created_at DESC;")
    .then(({rows})=>{
        return rows
    })
}
