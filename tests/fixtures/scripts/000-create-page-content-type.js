module.exports = async migration => {
  const page = migration.createContentType('page', {
    name: 'Page',
    description: 'Standard page'
  });

  page.createField('title', {
    name: 'title',
    type: 'Symbol',
    localized: false,
    required: true,
    validations: [
      {
        size: {
          min: 0,
          max: 60
        }
      }
    ],
    disabled: false,
    omitted: false
  });
};
