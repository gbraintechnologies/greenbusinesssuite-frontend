import SearchIcon from "@/public/icons/SearchIcon";
import { FC } from "react";

type Props = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
};
const SearchBox: FC<Props> = ({ searchTerm, setSearchTerm, placeholder }) => {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100">
      <SearchIcon />
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="outline-none text-sm focus:outline-none w-full bg-transparent input-custom"
        placeholder={placeholder ?? "Search by name only"}
      />
    </div>
  );
};

export default SearchBox;
