export const mapColumns = [
  {
    Header: 'Country ISO',
    accessor: 'countryISO',
    className: 'cell-center'
  },
  {
    Header: 'City',
    accessor: 'city',
    className: 'cell-center'
  },
  {
    Header: 'Latitude',
    accessor: 'latitude',
    className: 'cell-center'
  },
  {
    Header: 'Longitude',
    accessor: 'longitude',
    className: 'cell-center'
  },
  {
    Header: 'Year of Birth',
    accessor: 'yob',
    className: 'cell-center'
  }
];

export const mapCSVHeaders = [
  { label: 'Country ISO', key: 'countryISO' },
  { label: 'City', key: 'city' },
  { label: 'Latitude', key: 'latitude' },
  { label: 'Longitude', key: 'longitude' },
  { label: 'Year of Birth', key: 'yob' }
];

export const timelineColumns = [
  {
    Header: 'Publication Date',
    accessor: 'date',
    className: 'cell-center'
  },
  {
    Header: 'Count',
    accessor: 'value',
    className: 'cell-center'
  }
];

export const timelineCSVHeaders = [
  { label: 'Publication Date', key: 'date' },
  { label: 'Count', key: 'value' }
];

export const languageColumns = [
  {
    Header: 'Language',
    accessor: 'lang',
    className: 'cell-center'
  },
  {
    Header: 'Count',
    accessor: 'count',
    className: 'cell-center'
  }
];

export const languageCSVHeaders = [
  { label: 'Language', key: 'lang' },
  { label: 'Count', key: 'count' }
];
