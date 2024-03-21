export const filterKeys = [
  { label: 'Publication Title', checked: false, value: 'titles', selectedValue: [] },
  { label: 'Publication Date', checked: false, value: 'pubDates', selectedValue: [] },
  { label: 'Genre', checked: false, value: 'genres', selectedValue: [] },
  { label: 'ResourceType', checked: false, value: 'typesOfResources', selectedValue: [] },
  { label: 'Category', checked: false, value: 'categories', selectedValue: [] },
  { label: 'Contributor', checked: false, value: 'contributors', selectedValue: [] },
  { label: 'Publisher', checked: false, value: 'publishers', selectedValue: [] },
  { label: 'Access Rights', checked: false, value: 'accessRights', selectedValue: [] },
  { label: 'Place of Publication', checked: false, value: 'pubPlaces', selectedValue: [] },
  { label: 'Language', checked: false, value: 'languages', selectedValue: [] },
  { label: 'Source Institution', checked: false, value: 'sourceInstitutions', selectedValue: [] }
];

export const filterKeysMap: any = {
  titles: 'title',
  pubDates: 'pubDate',
  genres: 'genre',
  typesOfResources: 'typesOfResource',
  categories: 'category',
  contributors: 'contributor',
  publishers: 'publisher',
  accessRights: 'accessRights',
  pubPlaces: 'pubPlace',
  languages: 'language',
  sourceInstitutions: 'sourceInstitution'
};
