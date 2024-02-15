import { Checkbox, Select, SelectItem } from "@nextui-org/react";
import { Rarities, States } from "../constants/collections";

export default function CollectionsFilter() {

    return (
        <div className="w-[90%] mx-auto h-[87vh] bg-white text-black m-4 border-1 border-gray-200 rounded-lg px-4 py-2 flex flex-col">
            {/** Categories filter */}
            <label className="block mt-1 mb-2 text-2xl font-bold font-sans">Filter by Categories:</label>
            <div className="flex flex-col">
                <div className="flex flex-col gap-2">
                    <Checkbox size="lg" className="mr-2 rounded">Cards</Checkbox>
                    <Checkbox size="lg" className="mr-2 rounded">DieCast</Checkbox>
                    <Checkbox size="lg" className="mr-2 rounded">Figures</Checkbox>
                </div>
            </div>

            {/** Price Filter */}
            <div>
                <label className="block mt-6 mb-2 text-2xl font-bold font-sans">Filter by Price:</label>
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
                    <button className="bg-teal-700 text-white hover:bg-teal-600 w-[25%] h-[40px] ml-0.25 px-4 rounded" onClick={() => console.log("It works")}>
                        Apply
                    </button>
                </div>
            </div>


            {/** State Filter */}
            <div>
                <label className="block mt-6 mb-2 text-2xl font-bold font-sans">Filter by State:</label>
                <div className="flex text-center">
                    <Select
                        label="Select an state"
                        className="max-w-xs"
                    >
                        {States.map((state: string) => (
                            <SelectItem key={state} value={state} className="text-black">
                                {state}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </div>

            {/** Rarity Filter */}
            <div>
                <label className="block mt-6 mb-2 text-2xl font-bold font-sans">Filter by Rarity:</label>
                <div className="flex text-center">
                    <Select
                        label="Select an state"
                        className="max-w-xs"
                    >
                        {Rarities.map((rarity: string) => (
                            <SelectItem key={rarity} value={rarity} className="text-black">
                                {rarity}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </div>
        </div>
    );
}