module.exports = async migration => {
  const page = migration.editContentType('page');

  page
    .createField('slug')
    .type('Symbol')
    .required(true)
    .name('url');
};
