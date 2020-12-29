const Blog = require('../models/blog')
const User = require('../models/user')

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

const usersInDb = async() => {
    const users = await User.find({})
    return users.map( u => u.toJSON())

}

module.exports = {
    initialBlogs, blogsInDB, usersInDb
}