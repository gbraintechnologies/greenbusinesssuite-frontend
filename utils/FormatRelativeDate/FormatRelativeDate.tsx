import { format, formatDistance, formatRelative, subDays } from "date-fns";

format(new Date(), "'Today is a' eeee");
//=> "Today is a Wednesday"

formatDistance(subDays(new Date(), 3), new Date(), { addSuffix: true });
//=> "3 days ago"

export const FormatRelativeDate = (date: any) => {
  let date1 = new Date(date).getTime();
  let date2 = new Date().getTime();

  let days = Math.abs(Math.ceil((date1 - date2) / (1000 * 60 * 60 * 24)));

  // console.log("day diff", days);
  if (Boolean(date))
    return formatRelative(subDays(new Date(date), days), new Date(date));
  //=> "last Friday at 7:26 p.m."
};
