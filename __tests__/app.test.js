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
const {review} = body
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
test('should return 400 when given an invalidId', () => {
    return request(app)
    .get("/api/reviews/chocolate")
    .expect(400)
    .then((({body:{msg}})=>{
        expect(msg).toBe('Bad Request')
        
            }))
});
    })
    

describe('GET /api/reviews/:review_id/comments', () => {
    test('should return an array of comments for a particular review', () => {
        return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({body})=>{
            const {comments} = body
      
            comments.forEach((comment)=>{
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at : expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        review_id : expect.any(Number),
                    })
                )
            })
        })
    })

    test('should return status 200 when given valid id but no comment', () => {
        return request(app)
        .get("/api/reviews/4/comments")
        .expect(200)
        .then(({body})=>{
            const { comments } = body;
            expect(comments).toEqual([]) 
        })
    });


    test('should return the comments with the most recent comments first', () => {

        return request(app)
        .get("/api/reviews/2/comments")
        .then(({body})=>{
            const { comments } = body;
expect(comments).toBeSortedBy('created_at',  {
    descending: true,
  })

        })
        
    });
    test('should return a 404 error when given an id that doesnt exist', () => {
        return request(app)
        .get("/api/reviews/523/comments")
        .expect(404)
        .then((({body:{msg}})=>{
    expect(msg).toBe("No review with that id")
    
        }))
        })
        test('should return 400 when given invalid review Id', () => {
            return request(app)
        .get("/api/reviews/banana/comments")
        .expect(400)
        .then((({body:{msg}})=>{
    expect(msg).toBe('Bad Request')
    
        }))
        });

    })

    describe('7. POST /api/reviews/:review_id/comments', () => {
        test('should respond with a comment with username and body added ', () => {
            const newComment = {
                username: "bainesface",
                body: 'this is a new comment'
              }
            return request(app)
            .post("/api/reviews/2/comments")
            .send(newComment)
            .expect(201)
            .then(({body})=>{
            const {comment} = body
            expect(comment).toEqual(
                expect.objectContaining({
                body: 'this is a new comment',
                votes: 0,
                author: "bainesface",
                review_id: 2,
                created_at: expect.any(String),
              })
            )
            })
        
        });
        test('should return status 400 when given a bad body', () => {
            const invalidBody = {
                username: "bainesface",
                nigel: 'this is bad request'
              }
              
            return request(app)
            .post("/api/reviews/2/comments")
            .send(invalidBody)
            .expect(400)
            .then((({body:{msg}})=>{
                expect(msg).toBe('Bad Request')
                
                    }))

                    
        });
        test('should return status 400 when given a bad username', () => {
          
              const invalidUsername = {
                manyThings: "bainesface",
                body: 'this is bad request'
              }
            return request(app)
            .post("/api/reviews/2/comments")
            .send(invalidUsername)
            .expect(400)
            .then((({body:{msg}})=>{
                expect(msg).toBe('Bad Request')
                
                    }))

                    
        });
        test('should respond with a 404 when given a bad review that doesnt exist', () => {
            
            const invalidUsername = {
                username: "bainesface",
                body: 'this is bad request'
              }
            return request(app)
            .post("/api/reviews/2632/comments")
            .send(invalidUsername)
            .expect(404)
            .then((({body:{msg}})=>{
                expect(msg).toBe('Bad Request')
                
                    }))
        });

   
    test('should respond with a 400 when given a bad review id', () => {
        
        const invalidUsername = {
            username: "bainesface",
            body: 'this is bad request'
          }
        return request(app)
        .post("/api/reviews/banaa/comments")
        .send(invalidUsername)
        .expect(400)
        .then((({body:{msg}})=>{
            expect(msg).toBe('Bad Request')
            
                }))
    });
    test('should respond with a 404 when given a user that doesnt exist', () => {
        
        const invalidUsername = {
            username: "michelle",
            body: 'this is bad request'
          }
        return request(app)
        .post("/api/reviews/banaa/comments")
        .send(invalidUsername)
        .expect(400)
        .then((({body:{msg}})=>{
            expect(msg).toBe('Bad Request')
            
                }))
    });
   
            
        });


