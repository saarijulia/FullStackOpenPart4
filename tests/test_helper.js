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

const blogsInDB = async() => {
const blogs = await Blog.find({})
return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDB
}