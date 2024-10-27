import SearchIcon from "@/public/icons/SearchIcon";
import { FC } from "react";

type Props = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
};
const SearchBox: FC<Props> = ({ searchTerm, setSearchTerm, placeholder }) => {
  return (
    <div className="border   border-[#E2E8F0] rounded-xl px-3 py-2 text-sm flex gap-2 items-center">
      <SearchIcon />
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="outline-none text-sm focus:outline-none w-full bg-white input-custom"
        placeholder={placeholder ?? "Search by name only"}
      />
    </div>
  );
};

export default SearchBox;
