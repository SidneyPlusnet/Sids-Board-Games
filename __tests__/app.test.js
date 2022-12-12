const app = require("../app");
const db = require("../db/data/development-data");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data")

beforeEach(()=>{

return seed(testData)
}
)


afterAll(() => {
    if (db.end) db.end();
  });



  describe('Get/api/categories', () => {
    test('Status 200 - should respond with an array of category objects', () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({body})=>{
            const { categories } = body;
            expect(categories).toBeInstanceOf(Array);
            console.log(categories);

        })
    });

  });
  describe('Get/api/reviews', () => {
    test('Status 200 - Should respond with an array of review objects ', () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({})=>{


        })
        
    });
  });