const data = [
  {
    country: 'Argentina',
    year: 2023,
    population: 38859125,
    perCapita: 7.687,
    continent: 'southAmerica'
  },
  {
    country: 'Armenia',
    year: 2022,
    population: 2810664,
    perCapita: 2.384,
    continent: 'europe'
  },
  {
    country: 'Aruba',
    year: 2021,
    population: 97110,
    perCapita: 2.06,
    continent: 'northAmerica'
  },
  {
    country: 'Australia',
    year: 2020,
    population: 21600180,
    perCapita: 12.074,
    continent: 'oceania'
  },
  {
    country: 'Austria',
    year: 2019,
    population: 8079615,
    perCapita: 15.978,
    continent: 'europe'
  },
  {
    country: 'Bahamas',
    year: 2018,
    population: 348959,
    perCapita: 1.433,
    continent: 'northAmerica'
  },
  {
    country: 'Bahrain',
    year: 2017,
    population: 1214492,
    perCapita: 0.412,
    continent: 'asia'
  },
  {
    country: 'Belarus',
    year: 2016,
    population: 8910240,
    perCapita: 21.346,
    continent: 'europe'
  },
  {
    country: 'Belgium',
    year: 2015,
    population: 10526149,
    perCapita: 18.003,
    continent: 'europe'
  },
  {
    country: 'Belize',
    year: 2014,
    population: 305888,
    perCapita: 5.558,
    continent: 'northAmerica'
  },
  {
    country: 'Brazil',
    year: 2013,
    population: 187458852,
    perCapita: 5.608,
    continent: 'southAmerica'
  },
  {
    country: 'Brunei Darussalam',
    year: 2012,
    population: 373361,
    perCapita: 1.071,
    continent: 'asia'
  },
  {
    country: 'Bulgaria',
    year: 2011,
    population: 6920644,
    perCapita: 10.418,
    continent: 'europe'
  },
  {
    country: 'Canada',
    year: 2010,
    population: 33314836,
    perCapita: 12.169,
    continent: 'northAmerica'
  },
  {
    country: 'Chile',
    year: 2009,
    population: 16242244,
    perCapita: 10.7,
    continent: 'southAmerica'
  },
  {
    country: 'Colombia',
    year: 2008,
    population: 43546298,
    perCapita: 4.749,
    continent: 'southAmerica'
  },
  {
    country: 'Costa Rica',
    year: 2007,
    population: 4347229,
    perCapita: 7.154,
    continent: 'northAmerica'
  },
  {
    country: 'Croatia',
    year: 2006,
    population: 4044457,
    perCapita: 17.11,
    continent: 'europe'
  },
  {
    country: 'Cuba',
    year: 2005,
    population: 10792690,
    perCapita: 13.889,
    continent: 'northAmerica'
  },
  {
    country: 'Cyprus',
    year: 2004,
    population: 813016,
    perCapita: 5.535,
    continent: 'europe'
  },
  {
    country: 'Czech Republic',
    year: 2003,
    population: 9936780,
    perCapita: 15.87,
    continent: 'europe'
  },
  {
    country: 'Denmark',
    year: 2002,
    population: 5299698,
    perCapita: 11.51,
    continent: 'europe'
  },
  {
    country: 'Ecuador',
    year: 2001,
    population: 14054613,
    perCapita: 4.81,
    continent: 'southAmerica'
  },
  {
    country: 'Egypt',
    year: 2000,
    population: 78431389,
    perCapita: 0.19,
    continent: 'africa'
  },
  {
    country: 'El Salvador',
    year: 1999,
    population: 5657250,
    perCapita: 8.555,
    continent: 'northAmerica'
  },
  {
    country: 'Estonia',
    year: 1998,
    population: 1243096,
    perCapita: 17.537,
    continent: 'europe'
  },
  {
    country: 'Finland',
    year: 1997,
    population: 5135433,
    perCapita: 17.272,
    continent: 'europe'
  },
  {
    country: 'France',
    year: 1996,
    population: 59910069,
    perCapita: 16.024,
    continent: 'europe'
  },
  {
    country: 'French Guiana',
    year: 1995,
    population: 222674,
    perCapita: 8.533,
    continent: 'southAmerica'
  },
  {
    country: 'Georgia',
    year: 1994,
    population: 4192600,
    perCapita: 3.745,
    continent: 'europe'
  },
  {
    country: 'Germany',
    year: 1993,
    population: 77270988,
    perCapita: 13.059,
    continent: 'europe'
  },
  {
    country: 'Greece',
    year: 1992,
    population: 10431289,
    perCapita: 5.11,
    continent: 'europe'
  },
  {
    country: 'Guadeloupe',
    year: 1991,
    population: 424123,
    perCapita: 9.195,
    continent: 'northAmerica'
  },
  {
    country: 'Guatemala',
    year: 1990,
    population: 13641878,
    perCapita: 3.335,
    continent: 'northAmerica'
  },
  {
    country: 'Guyana',
    year: 1989,
    population: 683867,
    perCapita: 30.708,
    continent: 'southAmerica'
  },
  {
    country: 'Hong Kong SAR',
    year: 1988,
    population: 6919200,
    perCapita: 14.409,
    continent: 'asia'
  },
  {
    country: 'Hungary',
    year: 1987,
    population: 9433840,
    perCapita: 22.175,
    continent: 'europe'
  },
  {
    country: 'Iceland',
    year: 1986,
    population: 300456,
    perCapita: 16.309,
    continent: 'europe'
  },
  {
    country: 'Iran (Islamic Rep of)',
    year: 1985,
    population: 70575720,
    perCapita: 3.46,
    continent: 'asia'
  },
  {
    country: 'Ireland',
    year: 1984,
    population: 4227378,
    perCapita: 11.52,
    continent: 'europe'
  },
  {
    country: 'Israel',
    year: 1983,
    population: 7226008,
    perCapita: 5.148,
    continent: 'asia'
  },
  {
    country: 'Italy',
    year: 1982,
    population: 57503331,
    perCapita: 7.46,
    continent: 'europe'
  },
  {
    country: 'Japan',
    year: 1981,
    population: 120514000,
    perCapita: 21.567,
    continent: 'asia'
  },
  {
    country: 'Kazakhstan',
    year: 1980,
    population: 15215382,
    perCapita: 23.082,
    continent: 'europe'
  },
  {
    country: 'Kuwait',
    year: 1979,
    population: 3574090,
    perCapita: 1.147,
    continent: 'asia'
  },
  {
    country: 'Kyrgyzstan',
    year: 1978,
    population: 5012200,
    perCapita: 8.898,
    continent: 'asia'
  },
  {
    country: 'Latvia',
    year: 1977,
    population: 1912464,
    perCapita: 20.027,
    continent: 'europe'
  },
  {
    country: 'Lithuania',
    year: 1976,
    population: 2806627,
    perCapita: 38.659,
    continent: 'europe'
  },
  {
    country: 'Luxembourg',
    year: 1975,
    population: 512689,
    perCapita: 7.802,
    continent: 'europe'
  },
  {
    country: 'Malta',
    year: 1974,
    population: 402728,
    perCapita: 5.463,
    continent: 'europe'
  },
  {
    country: 'Martinique',
    year: 1973,
    population: 367843,
    perCapita: 7.34,
    continent: 'northAmerica'
  },
  {
    country: 'Mauritius',
    year: 1972,
    population: 1147390,
    perCapita: 8.541,
    continent: 'southAmerica'
  },
  {
    country: 'Mayotte',
    year: 1971,
    population: 191591,
    perCapita: 1.566,
    continent: 'africa'
  },
  {
    country: 'Mexico',
    year: 1970,
    population: 111036708,
    perCapita: 5.143,
    continent: 'northAmerica'
  },
  {
    country: 'Netherlands',
    year: 1969,
    population: 15899508,
    perCapita: 11.673,
    continent: 'europe'
  },
  {
    country: 'New Zealand',
    year: 1968,
    population: 4129770,
    perCapita: 12.422,
    continent: 'oceania'
  },
  {
    country: 'Nicaragua',
    year: 1967,
    population: 5326935,
    perCapita: 6.589,
    continent: 'northAmerica'
  },
  {
    country: 'Norway',
    year: 1966,
    population: 4767605,
    perCapita: 11.62,
    continent: 'europe'
  },
  {
    country: 'Panama',
    year: 1965,
    population: 3457387,
    perCapita: 3.76,
    continent: 'northAmerica'
  },
  {
    country: 'Paraguay',
    year: 1964,
    population: 5786207,
    perCapita: 5.582,
    continent: 'southAmerica'
  },
  {
    country: 'Poland',
    year: 1963,
    population: 36023694,
    perCapita: 17.261,
    continent: 'europe'
  },
  {
    country: 'Portugal',
    year: 1962,
    population: 9985074,
    perCapita: 10.536,
    continent: 'europe'
  },
  {
    country: 'Puerto Rico',
    year: 1961,
    population: 3471665,
    perCapita: 6.942,
    continent: 'northAmerica'
  },
  {
    country: 'Qatar',
    year: 1960,
    population: 2135349,
    perCapita: 1.733,
    continent: 'asia'
  },
  {
    country: 'Republic of Korea',
    year: 1959,
    population: 48248224,
    perCapita: 29.9,
    continent: 'asia'
  },
  {
    country: 'Republic of Moldova',
    year: 1958,
    population: 3363814,
    perCapita: 17.123,
    continent: 'europe'
  },
  {
    country: 'Reunion',
    year: 1957,
    population: 781254,
    perCapita: 11.904,
    continent: 'africa'
  },
  {
    country: 'Rodrigues',
    year: 1956,
    population: 37773,
    perCapita: 5.295,
    continent: 'africa'
  },
  {
    country: 'Romania',
    year: 1955,
    population: 19003345,
    perCapita: 12.666,
    continent: 'europe'
  },
  {
    country: 'Russian Federation',
    year: 1954,
    population: 134713962,
    perCapita: 21.297,
    continent: 'europe'
  },
  {
    country: 'Saint Lucia',
    year: 1953,
    population: 164790,
    perCapita: 8.496,
    continent: 'northAmerica'
  },
  {
    country: 'Serbia',
    year: 1952,
    population: 6832840,
    perCapita: 17.518,
    continent: 'europe'
  },
  {
    country: 'Seychelles',
    year: 1951,
    population: 82541,
    perCapita: 10.904,
    continent: 'africa'
  },
  {
    country: 'Singapore',
    year: 1950,
    population: 3661456,
    perCapita: 9.75,
    continent: 'asia'
  },
  {
    country: 'Slovakia',
    year: 1949,
    population: 5122209,
    perCapita: 12.026,
    continent: 'europe'
  },
  {
    country: 'Slovenia',
    year: 1948,
    population: 1948276,
    perCapita: 22.892,
    continent: 'europe'
  },
  {
    country: 'South Africa',
    year: 1947,
    population: 48192699,
    perCapita: 1.218,
    continent: 'africa'
  },
  {
    country: 'Spain',
    year: 1946,
    population: 44227625,
    perCapita: 8.757,
    continent: 'europe'
  },
  {
    country: 'Suriname',
    year: 1945,
    population: 492359,
    perCapita: 26.607,
    continent: 'southAmerica'
  },
  {
    country: 'Sweden',
    year: 1944,
    population: 9024081,
    perCapita: 13.63,
    continent: 'europe'
  },
  {
    country: 'Switzerland',
    year: 1943,
    population: 7681318,
    perCapita: 13.943,
    continent: 'europe'
  },
  {
    country: 'TFYR Macedonia',
    year: 1942,
    population: 1947542,
    perCapita: 8.729,
    continent: 'europe'
  },
  {
    country: 'Thailand',
    year: 1941,
    population: 60766487,
    perCapita: 6.518,
    continent: 'asia'
  },
  {
    country: 'Turkey',
    year: 1940,
    population: 69880352,
    perCapita: 2.59,
    continent: 'europe'
  },
  {
    country: 'Turkmenistan',
    year: 1939,
    population: 4748055,
    perCapita: 2.127,
    continent: 'asia'
  },
  {
    country: 'United Kingdom',
    year: 1938,
    population: 60091793,
    perCapita: 8.028,
    continent: 'europe'
  },
  {
    country: 'United States of America',
    year: 1937,
    population: 295322862,
    perCapita: 13.932,
    continent: 'northAmerica'
  },
  {
    country: 'Uruguay',
    year: 1936,
    population: 3164670,
    perCapita: 17.253,
    continent: 'southAmerica'
  },
  {
    country: 'Uzbekistan',
    year: 1935,
    population: 26838924,
    perCapita: 7.266,
    continent: 'asia'
  },
  {
    country: 'Venezuela (Bolivarian Republic of)',
    year: 1934,
    population: 27345912,
    perCapita: 2.26,
    continent: 'southAmerica'
  }
];

export default data;
