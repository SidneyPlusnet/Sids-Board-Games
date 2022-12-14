const { request, response } = require("../app")
const reviews = require("../db/data/development-data/reviews")
const {selectCategories, selectReviews, selectReviewId, selectCommentsByReviewId, insertComment} = require("../models/games")

exports.getCategories = (request, response, next) => {
selectCategories().then((categories)=>{
response.status(200).send({categories})
}).catch(next)
}
exports.getReviews = (request,response, next) =>{
    selectReviews().then((reviews)=>{
    response.status(200).send({reviews})
    
    }).catch(next)
    
    }
    exports.getReviewId = (request, response, next) =>{
        const { review_id } = request.params;
        selectReviewId(review_id).then((review)=>{
            response.status(200).send({review})
        }).catch(next)
    }

    exports.getCommentsByReviewId = (request, response, next) => {
        const { review_id } = request.params;
        selectCommentsByReviewId(review_id).then((comments)=>{
            response.status(200).send({comments})
        }).catch(next)
    }

    exports.postComment = (request, response, next) => {
        console.log("controller")
        const { review_id } = request.params;
const comment = request.body
insertComment(comment, review_id).then((comment)=>{
response.status(201).send({comment})
})
}
    
