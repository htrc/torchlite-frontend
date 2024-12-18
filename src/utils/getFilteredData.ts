export const getFilteredData = (data: any, minDate: number, maxDate: number) => {
  return data.filter((item: any) => item.date >= minDate && item.date <= maxDate);
};
