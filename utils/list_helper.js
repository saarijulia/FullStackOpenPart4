// a dummy test function 
const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    let sum = 0;
    blogs.map(blog => sum += blog.likes)
    return sum;
}

const favouriteBlog = (blogs) => {
    let bestBlog;

    // eslint-disable-next-line array-callback-return
    blogs.map(blog => {
        if (!bestBlog) {
            bestBlog = {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
        }
        else if (blog.likes > bestBlog.likes) {
            bestBlog = {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
        }
    })
    console.log('BESTBLOG TEST', bestBlog);
    return bestBlog;
}

const mostBlogs = (blogs) => {
    const authorBlogs = [];

    const addBlog = (author) => {
        authorBlogs.find(authorBlog => authorBlog.author === author).blogs = authorBlogs.find(authorBlog => authorBlog.author === author).blogs + 1
    }

    blogs.map(blog => {
        if (authorBlogs.some(author => author.author === blog.author)) {
            addBlog(blog.author)
        } else {
            authorBlogs.push({ author: blog.author, blogs: 1 })
        }
    })

    console.log('authors and their blogs:', authorBlogs);

    let authorWithMostBlogs;
    authorBlogs.map(author => {
        if (!authorWithMostBlogs) {
            authorWithMostBlogs = author;
        }
        else if (author.blogs > authorWithMostBlogs.blogs) {
            authorWithMostBlogs = author;
        }
    })

    console.log(authorWithMostBlogs);
    return authorWithMostBlogs;

}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs
}