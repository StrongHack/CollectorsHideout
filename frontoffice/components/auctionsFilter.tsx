import Searchbar from "./searchbar";

export default function AuctionsFilter() {

    return (
        <div className="w-[90%] mx-auto h-[87vh] bg-white text-black m-4 border-1 border-gray-200 rounded-lg px-4 py-2 flex flex-col">
            {/** Min Bid Filter */}
            <div>
            <label className="block mt-2 mb-2 text-2xl font-bold font-sans">Filter by Name:</label>
              <Searchbar />
            </div>
            <div>
                <label className="block mt-6 mb-2 text-2xl font-bold font-sans">Filter by Minimum Bid:</label>
                <div className="flex text-center">
                    <input
                        type="number"
                        placeholder="Min"
                        //value={priceRange.min}
                        //onChange={(e) => handlePriceChange(e, 'min')}
                        className="border w-[37.5%] h-[40px] h-6 border-gray-300 px-2 py-1"
                    />
                    <label className="mx-2 text-lg w-[5%]"> - </label>
                    <input
                        type="number"
                        placeholder="Max"
                        //value={priceRange.max}
                        //onChange={(e) => handlePriceChange(e, 'max')}
                        className="border w-[37.5%] h-[40px] h-6 border-gray-300 px-2 py-1 mr-2"
                    />
                    <button className="bg-teal-700 hover:bg-teal-600 w-[30%] h-[40px] text-white ml-0.25 px-4 rounded" onClick={() => console.log("It works")}>
                        Apply
                    </button>
                </div>
            </div>
            {/** Highest Bid Filter */}
            <div>
                <label className="block mt-6 mb-2 text-2xl font-bold font-sans">Filter by Highest Bid:</label>
                <div className="flex text-center">
                    <input
                        type="number"
                        placeholder="Min"
                        //value={priceRange.min}
                        //onChange={(e) => handlePriceChange(e, 'min')}
                        className="border w-[37.5%] h-[40px] h-6 border-gray-300 px-2 py-1"
                    />
                    <label className="mx-2 w-[5%] text-lg"> - </label>
                    <input
                        type="number"
                        placeholder="Max"
                        //value={priceRange.max}
                        //onChange={(e) => handlePriceChange(e, 'max')}
                        className="border w-[37.5%] h-[40px] h-6 border-gray-300 px-2 py-1 mr-2"
                    />
                    <button className="bg-teal-700 hover:bg-teal-600 w-[30%] h-[40px] text-white ml-0.25 px-4 rounded" onClick={() => console.log("It works")}>
                        Apply
                    </button>
                </div>
            </div>
            {/** Time Left Filter */}
            <div>
                <label className="block mt-6 mb-2 text-2xl font-bold font-sans">Filter by Time Left:</label>
                <div className="flex text-center">
                    <input
                        type="number"
                        placeholder="Time"
                        min={0}
                        //value={priceRange.max}
                        //onChange={(e) => handlePriceChange(e, 'max')}
                        className="border w-[75%] h-[40px] h-6 border-gray-300 px-2 py-1 mr-2"
                    />
                    <button className="bg-teal-700 hover:bg-teal-600 w-[30%] h-[40px] text-white ml-0.25 px-4 rounded" onClick={() => console.log("It works")}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}