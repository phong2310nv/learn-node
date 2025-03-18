const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const cleanCache = require("../middlewares/cleanCache");
const { getPresignedUrl } = require("../services/aws");
const Blog = mongoose.model("Blog");

module.exports = (app) => {
  app.get("/api/blogs/:id", requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    });
    console.log(blog);
    const processedBlog = {
      ...blog.toObject(),
      imageUrl: blog.imageUrl
        ? await getPresignedUrl(blog.imageUrl, "GET")
        : null,
    };
    res.send(processedBlog);
  });

  app.get("/api/blogs", requireLogin, async (req, res) => {
    const blogs = await Blog.find(
      { _user: req.user.id },
      { title: 1, content: 1 }
    ).cache({ key: req.user.id });
    res.send(blogs);
  });

  app.post("/api/blogs", requireLogin, cleanCache, async (req, res) => {
    const { title, content, imageUrl } = req.body;

    const blog = new Blog({
      title,
      content,
      imageUrl,
      _user: req.user.id,
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
