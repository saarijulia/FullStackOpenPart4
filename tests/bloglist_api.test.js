const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const blogsRouter = require('../controllers/blogs')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
   await Blog.deleteMany({})

   let blogObject = new Blog(helper.initialBlogs[0])
   await blogObject.save()

   blogObject = new Blog (helper.initialBlogs[1])
   await blogObject.save()
  })

  test('blogs can be retrieved', async () => {
      await api
        .get('/api/blogs/')
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    console.log('contents', response.body)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
    
  })

  test('id is defined', async() => {

    const response = await api.get('/api/blogs')
    const content = response.body[0];
    console.log('id is defined:',content)
    expect(content.id).toBeDefined()

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
    
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  
    const blogTitles = blogsAtEnd.map(b => b.title)

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

  describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
  })
  
afterAll(() => {
    mongoose.connection.close()
  }) 