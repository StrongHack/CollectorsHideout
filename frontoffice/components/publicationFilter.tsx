import { Checkbox, Select, SelectItem } from "@nextui-org/react";
import { Types } from "../constants/publications";

export default function PublicationsFilter() {
  return (
    <div className="min-w-64 w-[90%] mx-auto h-[87vh] bg-white text-black m-4 border-1 border-gray-200 rounded-lg px-4 py-2 flex flex-col">
      {/** Price Filter */}
      <div>
        <label className="block mt-6 mb-2 text-2xl font-bold font-sans">
          Filter by Price:
        </label>
        <div className="flex text-center">
          <input
            type="number"
            placeholder="Min"
            //value={priceRange.min}
            //onChange={(e) => handlePriceChange(e, 'min')}
            className="border w-[35%] h-[40px] h-6 border-gray-300 px-2 py-1"
          />
          <label className="mx-2 w-[5%] text-lg"> - </label>
          <input
            type="number"
            placeholder="Max"
            //value={priceRange.max}
            //onChange={(e) => handlePriceChange(e, 'max')}
            className="border w-[35%] h-[40px] h-6 border-gray-300 px-2 py-1 mr-2"
          />
          <button
            className="bg-teal-700 text-white hover:bg-teal-600 w-[25%] h-[40px] mx-auto px-4 rounded"
            onClick={() => console.log("It works")}
          >
            Apply
          </button>
        </div>
      </div>

      {/** State Filter */}
      <div>
        <label className="block mt-6 mb-2 text-2xl font-bold font-sans">
          Filter by Type:
        </label>
        <div className="flex text-center">
          <Select label="Select an Type" className="w-full">
            {Types.map((type: string) => (
              <SelectItem key={type} value={type} className="text-black">
                {type}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
