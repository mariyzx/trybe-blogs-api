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

const getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await postsService.getPostById(id);

  if (!post) return res.status(404).json({ message: 'Post does not exist' });
  console.log(req.user.data);
  res.status(200).json(post);
};

const updatePostById = async (req, res) => {
  const { id } = req.params; 
  const { data } = req.user;
  const postInfo = req.body;

  const { error, updatedPost } = await postsService.updatePostById(id, data.displayName, postInfo);

  if (error === 'Unauthorized user') return res.status(401).json({ message: error });
  if (error) return res.status(400).json({ message: error });

  res.status(200).json(updatedPost);
};

module.exports = { createPost, getAllPosts, getPostById, updatePostById };