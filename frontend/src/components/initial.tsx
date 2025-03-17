import React from "react";
import icon1 from "../assets/icon1.png";
import icon2 from "../assets/icon2.png";
import icon3 from "../assets/icon3.png";
import InfiniteCarousel from "./InfinityCarousel";
const FashionCollection: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl md:text-5xl font-bold text-center">
        Where style speaks, trends resonate, <br /> fashion flourishes
      </h1>
      <p className="text-gray-400 text-center mt-4 max-w-2xl">
        Something Trippy is Coming! Get ready to experience fashion like never
        before. buyit is dropping soon – bold, vibrant, and unapologetically
        YOU.
      </p>
      <button className="mt-6 px-6 py-3 bg-white text-black font-semibold rounded-full flex items-center gap-2 hover:bg-gray-300">
        New Collection →
      </button>
      <InfiniteCarousel />
      {/* Features Section */}
      <div className="mt-12 text-center">
        <h2 className="text-xl md:text-2xl font-bold">All Collection</h2>
        <p className="text-gray-400">
          World’s First Layer 2 Fashion Marketplace
        </p>
        <div className="flex justify-center gap-10 mt-6">
          <div className="flex flex-col items-center">
            <img
              src={icon2}
              alt="No Gas Fees"
              className="w-12 h-12"
              style={{
                filter:
                  "invert(41%) sepia(94%) saturate(7452%) hue-rotate(268deg) brightness(103%) contrast(102%)",
              }}
            />
            <p className="text-sm mt-2">No Gas Fees</p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={icon3}
              alt="Carbon Neutral NFTs"
              className="w-12 h-12"
              style={{
                filter:
                  "invert(41%) sepia(94%) saturate(7452%) hue-rotate(268deg) brightness(103%) contrast(102%)",
              }}
            />
            <p className="text-sm mt-2">Carbon Neutral NFTs</p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={icon1}
              alt="Fast And Easy Transactions"
              className="w-12 h-12"
              style={{
                filter:
                  "invert(41%) sepia(94%) saturate(7452%) hue-rotate(268deg) brightness(103%) contrast(102%)",
              }}
            />
            <p className="text-sm mt-2">Fast And Easy Transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionCollection;
