export const WidgetType = {
  MappingContributorData: 'MappingContributorData',
  PublicationDateTimeline: 'PublicationDateTimeline',
  Summary: 'Summary',
  SimpleTagCloud: 'SimpleTagCloud'
};

export const WidgetInfoLinks: any = {
  MappingContributorData: {
    github: 'https://github.com/htrc/torchlite-frontend/wiki/Map-Widget',
    lib: 'https://github.com/topojson/topojson-client',
    insights: 'https://github.com/htrc/torchlite-frontend/wiki/Map-Widget'
  },
  PublicationDateTimeline: {
    github: 'https://github.com/htrc/torchlite-frontend/wiki/Timeline-Widget',
    lib: 'https://d3js.org/',
    insights: 'https://github.com/htrc/torchlite-frontend/wiki/Timeline-Widget'
  }
};

export const WidgetTitles: any = {
  MappingContributorData: 'Mapping Creator Birthplaces',
  PublicationDateTimeline: 'Publication Date Timeline',
  Summary: 'Workset Summary',
  SimpleTagCloud: 'Word Frequency Cloud'
};

export const TableColumns: any = {
  MappingContributorData: [
    {
      Header: 'Country ISO',
      accessor: 'countryIso',
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
      accessor: 'yearOfBirth',
      className: 'cell-center'
    }
  ],
  PublicationDateTimeline: [
    {
      Header: 'Publication Date',
      accessor: 'year',
      className: 'cell-center'
    },
    {
      Header: 'Count',
      accessor: 'count',
      className: 'cell-center'
    }
  ],
  Summary: [
    {
      Header: 'Title',
      accessor: 'title',
      className: 'cell-center'
    },
    {
      Header: 'Length',
      accessor: 'length',
      className: 'cell-center'
    },
    {
      Header: 'Density',
      accessor: 'density',
      className: 'cell-center'
    }
  ],
  SimpleTagCloud: [
    {
      Header: 'Word',
      accessor: 'text',
      className: 'cell-center'
    },
    {
      Header: 'Count',
      accessor: 'value',
      className: 'cell-center'
    }
  ]
};

export const CSVHeaders: any = {
  MappingContributorData: [
    { label: 'Country ISO', key: 'countryIso' },
    { label: 'City', key: 'city' },
    { label: 'Latitude', key: 'latitude' },
    { label: 'Longitude', key: 'longitude' },
    { label: 'Year of Birth', key: 'yearOfBirth' }
  ],
  PublicationDateTimeline: [
    { label: 'Publication Date', key: 'year' },
    { label: 'Count', key: 'count' }
  ],
  Summary: [
    { label: 'Title', key: 'title' },
    { label: 'Length', key: 'length' },
    { label: 'Density', key: 'density' }
  ],
  SimpleTagCloud: [
    { label: 'Word', key: 'text' },
    { label: 'Count', key: 'value' }
  ]
};

export const TableHeader: any = {
  MappingContributorData: 'Contributor Data',
  PublicationDateTimeline: 'Timeline Data',
  Summary: 'Summary Data',
  SimpleTagCloud: 'Word Cloud Data'
};
