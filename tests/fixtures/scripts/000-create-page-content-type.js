module.exports = async migration => {
  const author = migration.createContentType('page1', {
    name: 'Page2',
    description: 'Page creation (for multiple site)',
    displayField: 'title',
    fields: [
      {
        id: 'title',
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
      },
      {
        id: 'slug',
        name: 'slug',
        type: 'Symbol',
        localized: false,
        required: true,
        validations: [
          {
            unique: true
          }
        ],
        disabled: false,
        omitted: false
      },
      {
        id: 'metaDescription',
        name: 'meta description',
        type: 'Symbol',
        localized: false,
        required: true,
        validations: [
          {
            size: {
              min: 0,
              max: 160
            }
          }
        ],
        disabled: false,
        omitted: false
      },
      {
        id: 'metaKeywords',
        name: 'meta keywords',
        type: 'Symbol',
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false
      },
      {
        id: 'body',
        name: 'body',
        type: 'Array',
        localized: false,
        required: true,
        validations: [],
        disabled: false,
        omitted: false,
        items: {
          type: 'Link',
          validations: [
            {
              linkContentType: ['section']
            }
          ],
          linkType: 'Entry'
        }
      },
      {
        id: 'seo',
        name: 'seo',
        type: 'Link',
        localized: false,
        required: false,
        validations: [
          {
            linkContentType: ['listGridItem'],
            message: 'use seo content model'
          }
        ],
        disabled: false,
        omitted: false,
        linkType: 'Entry'
      }
    ]
  });
};
