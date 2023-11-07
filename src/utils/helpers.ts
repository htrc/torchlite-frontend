import { IMapData, ITimelineChart } from 'types/chart';
import { ZodObject } from 'zod';

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

export function getCookieValue(cookieName: any) {
  const name = cookieName + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}

export function hasFilters(filterObj: any): boolean {
  return Object.values(filterObj).some((value: any) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    } else {
      return value !== null && value !== undefined;
    }
  });
}

export function pickRandom<T>(arr: T[]): T {
  if (!arr) throw Error('Cannot pick random element from empty array');
  return arr[Math.floor(Math.random() * arr.length)];
}

export function isValidBody<T>(body: any, bodySchema: ZodObject<any>): body is T {
  const { success } = bodySchema.safeParse(body);
  return success;
}
