module.exports = async migration => {
  const page = migration.editContentType('page');

  page
    .createField('metaDescription')
    .type('Symbol')
    .required(true)
    .name('meta description');
};
