const currentPosition = -1;

module.exports = {
  sys: {
    type: 'Extension',
    id: 'contentful-management-update-state-store',
    version: 1,
    createdAt: '2020-01-23T10:34:54.230Z',
    updatedAt: '2020-01-23T10:34:54.230Z',
    createdBy: { sys: { id: '0fJlI6nf2ItXF5FAyP1Wuh', type: 'Link', linkType: 'User' } },
    updatedBy: { sys: { id: '0fJlI6nf2ItXF5FAyP1Wuh', type: 'Link', linkType: 'User' } },
    space: { sys: { type: 'Link', linkType: 'Space', id: '093jeulqtg2i' } },
    environment: { sys: { type: 'Link', linkType: 'Environment', id: 'master' } },
    srcdocSha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
  },
  extension: {
    name: 'My awesome extension',
    srcdoc: currentPosition,
    sidebar: false,
    fieldTypes: [{ type: 'Symbol' }, { type: 'Text' }]
  },
  update: () => {}
};
