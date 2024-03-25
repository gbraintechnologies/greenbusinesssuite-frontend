// datefns
import { format } from "date-fns/format";

const FormatDate = (date: any) => {
  if (Boolean(date)) return format(new Date(date), "EEEE, do MMMM, yyyy");
};

export default FormatDate;
