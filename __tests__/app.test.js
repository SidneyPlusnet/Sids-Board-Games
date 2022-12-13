const app = require("../app");
const db = require("../db/data/development-data");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data")
const sorting = require('jest-sorted');

beforeEach(()=>{

return seed(testData)
}
)


afterAll(() => {
    if (db.end){ 
       return db.end()};
  });

describe('Testing for bad path', () => {
    test('should return 404 error', () => {
        return request(app)
        .get('/non-path')
        .expect(404)
        .then(({body: {msg}})=>{
expect(msg).toBe('path not found')
        })
    });
    
});

  describe('Get /api/categories', () => {
    test('Status 200 - should respond with an array of category objects', () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({body})=>{
            const { categories } = body;
            expect(categories).toBeInstanceOf(Array)
            expect(categories[0]).toBeInstanceOf(Object);
            expect.objectContaining({ slug: 'euro game', description: 'Abstact games that involve little luck' }),
            expect(categories.length).toBe(4)

        })
    });

  });
  describe('Get /api/reviews', () => {
    test('Status 200 - Should respond with an array of review objects ', () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({body})=>{
            const { reviews } = body;
            expect(reviews.length).toBe(13)
            expect(reviews[0]).toBeInstanceOf(Object);
            reviews.forEach((review)=>{
                expect(review).toEqual(
                    expect.objectContaining({
                        review_id: expect.any(Number),
                        title: expect.any(String),
                        category: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(String)
                    })
                )
            })
        })
        
    });
    test('should sort date by date in descending order', () => {
        return request(app)
        .get("/api/reviews")
        .then(({body})=>{
            const { reviews } = body;
expect(reviews).toBeSortedBy('created_at',  {
    descending: true,
  })

        })
    });
  });
  describe('Get /api/reviews/:review_id', () => {

    test('should return a review object when given an id', () => {
        
    
    return request(app)
    .get("/api/reviews/2")
    .expect(200)
    .then(({body})=>{

        expect(review).toEqual(
            expect.objectContaining({
                review_id: 2,
                title: 'Jenga',
                category: 'dexterity',
                designer: 'Leslie Scott',
                owner: 'philippaclaire9',
                review_body: 'Fiddly fun for all the family',
                review_img_url:  'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                created_at: expect.any(String),
                votes: 5
            })
        )
    })
});

