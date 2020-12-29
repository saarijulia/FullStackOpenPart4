const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1})
        
    response.json(blogs)
})

blogsRouter.post('/', async(request, response) => {
    const body = request.body
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        author: user.name,
        title: body.title,
        likes: body.likes,
        url: body.url,
        user: user._id
    })
    if (!blog.likes) {
        blog.likes = 0;
    } 
    if (!blog.title || !blog.author){
        response.status(400).send({error: 'missing content'})
    } 
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(savedBlog)
    
   
})

blogsRouter.get('/:id', (request, response, next) => {
    const main = async () => {
        const blog = await Blog.findById(request.params.id)
        console.log('operation returned the following blog:', blog)
        if (blog) {
            response.json(blog)
        } else {
            response.status(404)
        }
    }
    main()
})

blogsRouter.delete('/:id', (request, response, next) => {
    const main = async () => {
        const blog = await Blog.findByIdAndRemove(request.params.id)
            if (blog) {
                console.log('deleted:', blog)
            } else {
                    response.status(204).end()
            }
        }
   main()
})

blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body
  
    const blog = {
      author: body.author,
      title: body.title,
      likes: body.likes
    }
  const main = async () => {
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(updatedBlog.toJSON())
  }
    main()
  })


module.exports = blogsRouter