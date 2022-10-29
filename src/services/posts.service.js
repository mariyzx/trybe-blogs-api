const { BlogPost, Category, User, PostCategory } = require('../models');
const { validatePost, validatePostById } = require('./auth.service');

const createPost = async ({ title, content, categoryIds }, { email }) => {
  const error = await validatePost({ title, content, categoryIds });
  if (error) return { error: { message: 'Some required fields are missing' } };

  const categories = categoryIds.map((cat) => Category.findOne({ where: { id: cat } }));
  const result = await Promise.all(categories);

  if (result.some((a) => a === null)) {
    return { error: { message: 'one or more "categoryIds" not found' } }; 
  }

  const { dataValues: { id: userId } } = await User.findOne({ where: { email } });
  const published = new Date();
  const updated = new Date();

  const dataValues = await BlogPost.create({ title, content, userId, published, updated });
  const { id: postId } = dataValues;
  categoryIds.map((id) => PostCategory.create({ postId, categoryId: id }));

  return dataValues;
};

const getAllPosts = async () => {
  const posts = await BlogPost.findAll({
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
  ],
  });

  return posts;
};

const getPostById = async (id) => {
  const post = await BlogPost.findOne({ where: { id },
  include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
  ] });

  return post;
};

const updatePostById = async (idPost, userInfo, postInfo) => {
  const post = await getPostById(idPost);
  const { user } = post;
  const { dataValues: { displayName } } = user;

  const error = await validatePostById(postInfo);
  if (error) return { error: 'Some required fields are missing' };

  if (displayName !== userInfo) return { error: 'Unauthorized user' };

  await BlogPost.update(
    { title: postInfo.title, content: postInfo.content }, { where: { id: idPost } },
  );

  const updatedPost = await getPostById(idPost);

  return { updatedPost };
};

const deletPostById = async (idPost, userInfo) => {
  const post = await getPostById(idPost);
  
  if (!post) return { error: 'Post does not exist' };

  const { user } = post;
  const { dataValues: { displayName } } = user;

  if (displayName !== userInfo) return { error: 'Unauthorized user' };

  await PostCategory.destroy({ where: { postId: idPost } });
  await BlogPost.destroy({ where: { id: idPost } });

  return { message: 'Post deleted!' };
};

module.exports = { createPost, getAllPosts, getPostById, updatePostById, deletPostById };