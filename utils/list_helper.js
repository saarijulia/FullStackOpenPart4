// a dummy test function 
const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    let sum = 0;
    blogs.map( blog => sum += blog.likes)
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
    } )
    console.log('BESTBLOG TEST', bestBlog);
    return bestBlog;
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}