module.exports = async migration => {
  const page = migration.editContentType('page');

  page
    .createField('metaDescription1')
    .type('Symbol')
    .required(true)
    .name('meta description2');
};
