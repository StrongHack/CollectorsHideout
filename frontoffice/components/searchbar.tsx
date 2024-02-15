import { useEffect, useState } from "react";
import { SearchBarProps } from "../types";

export default function Searchbar(props: SearchBarProps) {
  const [searchInput, setSearchInput] = useState<string>("");

  /**Commented to avoid erros - Working
  useEffect(() => {
    const filteredObjects = props.objects.filter((element: any) => {
      return element[props.filteringAttr].toString().includes(searchInput);
    });

    props.setFilteredObjects(filteredObjects);
  }, [props.objects, searchInput]);
  */

  return (
    <input
      className="w-[100%] text-black h-10 rounded-3xl px-4 border-2 bg-transparent border-gray-400 hover:border-gray-600"
      placeholder="Searchbar"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
    />
  );
}
