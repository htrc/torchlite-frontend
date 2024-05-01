export const WidgetType = {
  MappingContributorData: 'MappingContributorData',
  PublicationDateTimeline: 'PublicationDateTimeline',
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
  MappingContributorData: 'Mapping Contributor Data',
  PublicationDateTimeline: 'Publication Date Timeline',
  SimpleTagCloud: 'Simple Word Cloud'
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
  SimpleTagCloud: [
    {
      Header: 'Token',
      accessor: 0,
      className: 'cell-center'
    },
    {
      Header: 'Count',
      accessor: 1,
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
  SimpleTagCloud: [
    { label: 'Token', key: 0 },
    { label: 'Count', key: 1 }
  ]
};

export const TableHeader: any = {
  MappingContributorData: 'Contributor Data',
  PublicationDateTimeline: 'Timeline Data',
  SimpleTagCloud: 'Word Cloud Data'
};
