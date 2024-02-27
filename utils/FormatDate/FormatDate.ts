// datefns
import { format } from "date-fns/format";

const FormatDate = (date: any) => {
  if (Boolean(date)) return format(new Date(date), "EE, do MMM yyyy");
};

export default FormatDate;
