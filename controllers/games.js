const {selectCategories} = require("../models/games")

exports.getCategories = (request, response, next) => {
    console.log("I'm in the controller")
selectCategories().then((categories)=>{
response.status(200).send({categories})
}).catch(next)
}

// catch here