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

  test('adding a blog', async() => {
      const newBlog = {
        title: 'New Test Blog',
        author: 'Tester',
        url: 'NewTestBlog.com',
        likes: 0
      }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body.length).toEqual(initialBlogs.length + 1)
    const blogTitles = response.body.map(r => r.title)

    expect(blogTitles).toContain('New Test Blog')
  })

  test ('missing likes is 0', async() => {
    const newBlog = {
        title: 'New Test Blog 1',
        author: 'Tester',
        url: 'NewTestBlog.com',
      }

      await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      
      const response = await api.get('/api/blogs')
      const blogLikes = response.body.map(r => r.likes)
      expect(blogLikes[2]).toEqual(0)


  })

  test('missing data', async() => {
    const newBlog = {
        url: 'NewTestBlog.com',
      }

      await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })


afterAll(() => {
    mongoose.connection.close()
  }) 