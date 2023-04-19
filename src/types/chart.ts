export interface ITimeLineDataItem {
  date: number;
  count: number;
  type: string;
}

export interface IPublicDateTimeLineProp {
  element: any;
  data: any;
  setData: (param: any) => void;
  minDate: number;
  maxDate: number;
}