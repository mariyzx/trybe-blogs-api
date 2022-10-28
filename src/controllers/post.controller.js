const postsService = require('../services/posts.service');

const createPost = async (req, res) => {
  const { data } = req.user;
  const post = await postsService.createPost(req.body, data);
  const { error } = post;

  if (error) return res.status(400).json({ message: error.message });
  
  res.status(201).json(post);
};

const getAllPosts = async (req, res) => {
  const posts = await postsService.getAllPosts();

  res.status(200).json(posts);
};

module.exports = { createPost, getAllPosts };