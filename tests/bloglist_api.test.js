const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blogsRouter = require('../controllers/blogs')

const api = supertest(app)
const Blog = require('../models/blog')
const initialBlogs = [
    {
        title: 'Outfits 101',
        author: 'Brandon D',
        url: 'outfits1O1.com',
        likes: 500
    },

    {
        title: 'The art of baking',
        author: 'Lily Collins',
        url: 'theartofbaking.com',
        likes: 67
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    console.log('initial blogs:', initialBlogs)
  })

  test('blogs can be retrieved', async () => {
      await api
        .get('/api/blogs/')
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    console.log('contents', response.body)
    expect(response.body.length).toEqual(initialBlogs.length)
    
  })

  test('id is defined', async() => {

    const response = await api.get('/api/blogs')
    const content = response.body;
    console.log(content)
    expect(content[0].id).toBeDefined()

  })



/*test('a valid blog can be added', async () => {
   const newBlog = {
       title: 'Api Test blog',
       author: 'Julia',
       url: 'test.com',
       likes: 1
   }

   await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r=> r.content)
    console.log('test array contents:', contents)
    expect (response.body).toHaveLength(initialBlogs.length + 1)
    expect(contents).toContain(
        'Api Test blog'
    )
})*/

afterAll(() => {
    mongoose.connection.close()
  }) 