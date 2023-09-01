import { IMapData, ITimelineChart } from 'types/chart';

export type MapDataTableEntry = {
  countryISO: string;
  city: string;
  latitude: number;
  longitude: number;
  yob: number;
};

export function transformMapDataForDataTable(data: IMapData[]): MapDataTableEntry[] {
  return data.map((entry) => {
    // Extracting latitude and longitude
    const coords = entry.cityCoords.replace('Point(', '').replace(')', '').split(' ');
    const latitude = parseFloat(coords[1]);
    const longitude = parseFloat(coords[0]);

    // Extracting year of birth
    const yearOfBirth = new Date(entry.dob).getFullYear();

    return {
      countryISO: entry.countryiso,
      city: entry.city,
      latitude: latitude,
      longitude: longitude,
      yob: yearOfBirth
    };
  });
}

export function transformTimelineDataForDataTable(obj: any) {
  return Object.entries(obj).map(([key, value]) => ({
    publicationDate: parseInt(key, 10),
    count: value
  }));
}

export const convertToTimelineChartData = (worksetMetaData: any) => {
  return worksetMetaData.reduce((prev: any, curr: ITimelineChart) => {
    const pubDate = curr.metadata.pubDate;
    if (!Number.isInteger(pubDate)) {
      return prev;
    } else if (prev[pubDate]) return { ...prev, [pubDate]: prev[pubDate] + 1 };
    else return { ...prev, [pubDate]: 1 };
  }, {});
};

export const getCookieValue = (name: string, cookieString: string) => {
  const matches = cookieString.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return matches ? matches.pop() : null;
};
