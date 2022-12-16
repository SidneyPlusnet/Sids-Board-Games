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
        test('should respond with a 404 when given a review that doesnt exist', () => {
            
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
        .post("/api/reviews/2/comments")
        .send(invalidUsername)
        .expect(404)
        .then((({body:{msg}})=>{
            expect(msg).toBe('Bad Request')
            
                }))
    });
   
            
        });


        describe('8. PATCH /api/reviews/:review_id', () => {
            test('should respond with an updated review that includes new vote count', () => {
                const reviewUpdates = {inc_votes: 6 }
                return request(app)
                .patch("/api/reviews/2")
                .send(reviewUpdates)
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
                            votes: 11
                        })
                    )
                })
                
            });
            test('should return 400 when given a invalid body', () => {
                const badBody = {bad_votes: 6 }
                return request(app)
                .patch("/api/reviews/2")
                .send(badBody)
                .expect(400)
                .then((({body:{msg}})=>{
                    expect(msg).toBe('Bad Request')
                        }))
            });

            test('should respond with a 400 when given an invalid review id', () => {
                const body = {inc_votes: 6 }
                return request(app)
                .patch("/api/reviews/banana")
                .send(body)
                .expect(400)
                .then((({body:{msg}})=>{
                    expect(msg).toBe('Bad Request')
                        }))
            });

            test('should return 404 when given review id that doesnt exist', () => {
                const body = {inc_votes: 6 }
                return request(app)
                .patch("/api/reviews/515")
                .send(body)
                .expect(404)
                .then((({body:{msg}})=>{
                    expect(msg).toBe("No review with that id")
                        }))
            });

            test('should return 400 when given an invalid type in number of votes', () => {
                const body = {inc_votes: "chutney" }
                return request(app)
                .patch("/api/reviews/2")
                .send(body)
                .expect(400)
                .then((({body:{msg}})=>{
                    expect(msg).toBe("Bad Request")
                        }))
            });
          
        });

        describe('GET /api/users', () => {
            test('should  respond with an array of user objects', () => {
                return request(app)
                .get("/api/users")
                .expect(200)
                .then(({body})=>{
            
        const {users} = body
        expect(users.length).toBe(4);
                    expect(users[0]).toBeInstanceOf(Object);
                    users.forEach((user) => {
                      expect(user).toEqual(
                        expect.objectContaining({
                          username: expect.any(String),
                          name: expect.any(String),
                          avatar_url: expect.any(String)
                        })
                      );
                    });
        
                })
            });
        });

        describe('10. GET /api/reviews (queries)', () => {
            test('should select the reviews by the category value specified', () => {
                return request(app)
                .get("/api/reviews?category=dexterity")
                .expect(200)
                .then(({body: {reviews}})=>{
                    console.log(reviews, "reviews")
                    reviews.forEach((review)=>{
                        expect(review.category).toBe('dexterity')
                    })
                })
            });
            test('should sort articles by review_id', () => {
                return request(app)
                .get("/api/reviews?sort_by=review_id")
                .then(({body})=>{
                    const { reviews } = body;
        expect(reviews).toBeSortedBy('review_id',  {
            descending: true,
          })
        
                })
            });
            test('should sort articles by votes', () => {
                return request(app)
                .get("/api/reviews?sort_by=votes")
                .then(({body})=>{
                    const { reviews } = body;
        expect(reviews).toBeSortedBy('votes',  {
            descending: true,
          })
        
                })
            });
            test('should order by descending when requested', () => {
                return request(app)
                .get("/api/reviews?sort_by=votes&order_by=DESC")
                .then(({body})=>{
                    const { reviews } = body;
        expect(reviews).toBeSortedBy('votes',  {
            descending: true,
          })
        
                })
                
            });
            test('should order by ascending when requested', () => {
                return request(app)
                .get("/api/reviews?sort_by=votes&order_by=ASC")
                .then(({body})=>{
                    const { reviews } = body;
        expect(reviews).toBeSortedBy('votes',  {
            ascending: true,
          })
        
                })
            });
            test('should return 400 for invalid sort by query', () => {
                return request(app)
                .get("/api/reviews?sort_by=bananas")
                .expect(400)
                .then((({body:{msg}})=>{
                    expect(msg).toBe("Bad Request")
                        }))
            });
            test('should return 400 for invalid order by query', () => {
                return request(app)
                .get("/api/reviews?sort_by=votes&order_by=thompson")
                .expect(400)
                .then((({body:{msg}})=>{
                    expect(msg).toBe("Bad Request")
                        }))
            });
            test('should return 404 for non-existent category', () => {
                return request(app)
                .get("/api/reviews?category=lampshade")
                .expect(404)
                .then((({body:{msg}})=>{
                    expect(msg).toBe('Not a category')
                        }))
            });

            test('should return 200 for valid category with no reviews', () => {
                return request(app)
                .get("/api/reviews?category=children's games")
                .expect(200)
                
            });
        });