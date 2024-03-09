import SearchIcon from "@/public/icons/SearchIcon";
import { FC } from "react";

type Props = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};
const SearchBox: FC<Props> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="border shadow-sm focus:outline-primary-green border-gray-200 rounded-xl px-3 py-2 text-sm flex gap-2 items-center">
      <SearchIcon />
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="outline-none text-sm focus:outline-none bg-white"
        placeholder="Search by name only"
      />
    </div>
  );
};

export default SearchBox;
