const { BlogPost, Category, User, PostCategory } = require('../models');
const { validatePost } = require('./auth.service');

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

module.exports = { createPost, getAllPosts };