const db = require("../db/connection");

exports.selectCategories = () =>{
    console.log("I'm in the model")
return db
.query("SELECT * FROM categories;")
.then(({rows})=>{
    console.log(".then in models")
    console.log({rows}, "{rows}")
    console.log(rows, "rows")
return rows
})
}