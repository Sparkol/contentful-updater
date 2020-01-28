module.exports = async migration => {
  const author = migration.editContentType('author');
  author.moveField('test').toTheTop();
};
