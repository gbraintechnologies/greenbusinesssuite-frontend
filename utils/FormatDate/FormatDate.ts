// datefns
import { format } from "date-fns/format";

const FormatDate = (date: any) => {
  if (Boolean(date)) return format(new Date(date), "EEEE, do MMMM, yyyy");
};

export const FormatDateWithDayShort = (date: any) => {
  if (Boolean(date)) return format(new Date(date), "EE, do MMM, yyyy");
};

export const FormatDateShort = (date: any) => {
  if (Boolean(date)) return format(new Date(date), " do MMMM, yyyy");
};

export const FormatDateTime = (date: any) => {
  if (Boolean(date)) return format(new Date(date), "HH:mm, do MMM, yyyy");
};

export const  FormatDateWithSuffix = (date: any) =>  {
  const day = format(date, 'd'); 
  const monthAndYear = format(date, 'MMM, yyyy');
  const time = format(date, 'hh:mm a'); 

  const getOrdinalSuffix = (day: any) => {
    const dayNumber = parseInt(day, 10);
    if (dayNumber > 3 && dayNumber < 21) return 'th'; 
    switch (dayNumber % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
  return `${dayWithSuffix} ${monthAndYear} at ${time}`;
}

export default FormatDate;
