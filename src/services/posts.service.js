const { BlogPost, Category, User, PostCategory } = require('../models');
const { validatePost } = require('./auth.service');

const createPost = async ({ title, content, categoryIds }, { email }) => {
  // 1 - validar os campos
  const error = await validatePost({ title, content, categoryIds });
  console.log(error);
  if (error) return { error: { message: 'Some required fields are missing' } };

  // 2 - validar se as categorias existem
  const categories = categoryIds.map((cat) => Category.findOne({ where: { id: cat } }));
  const result = await Promise.all(categories);

  if (result.some((a) => a === null)) {
    return { error: { message: 'one or more "categoryIds" not found' } }; 
  }
  // 3 - achar o id do usuario
  const { dataValues: { id: userId } } = await User.findOne({ where: { email } });
  const published = new Date();
  const updated = new Date();
  // 4 - criar o post;
  const dataValues = await BlogPost.create({ title, content, userId, published, updated });
  const { id: postId } = dataValues;
  categoryIds.map((id) => PostCategory.create({ postId, categoryId: id }));

  return dataValues;
};

module.exports = { createPost };