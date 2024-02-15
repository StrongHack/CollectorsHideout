import { useEffect, useState } from "react";
import { SearchBarProps } from "../types";
import toast from "react-hot-toast";

export default function Searchbar(props: SearchBarProps) {
  const [searchInput, setSearchInput] = useState<string>("");

  useEffect(() => {
    try {
      const filteredObjects = props.objects.filter((element: any) => {
        return element[props.filteringAttr].toString().includes(searchInput);
      });

      props.setFilteredObjects(filteredObjects);
    } catch (error) {
      toast.error("Error filtering objects!")
    }
  }, [props.objects, searchInput]);

  return (
    <input
      className="w-[500px] text-black h-10 rounded-3xl px-4 border-2 bg-transparent border-gray-400 hover:border-gray-600"
      placeholder="Searchbar"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
    />
  );
}
