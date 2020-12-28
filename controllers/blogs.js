const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
    if (!blog.likes) {
        blog.likes = 0;
    }

    if (!blog.title || !blog.author){
        response.status(400).send({error: 'missing content'})
    }

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
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