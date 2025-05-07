import axios from "axios";
import React from "react";
import OfferList from "./OfferList";
import { Price } from "@/types/price";
import { CheckmarkIcon } from "react-hot-toast";

const PricingBox = ({ product }: { product: Price }) => {
  // POST request
  const handleSubscription = async (e: any) => {
    e.preventDefault();
    const { data } = await axios.post(
      "/api/payment",
      {
        priceId: product.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    window.location.assign(data);
  };

  return (
    <div className={`w-full px-4 md:w-1/2 lg:w-1/3  ${  product.nickname === "Premium"
      ? "relative z-15 shadow-lg scale-100 animate-[zoomInOut_1s_ease-in-out_infinite]"
      : "relative z-0 opacity-60 scale-90"}  `}>

<div
  className={`relative group  ${
    product.nickname === "Premium"
      ? "before:absolute before:-inset-0.5 before:rounded-xl before:bg-gradient-to-r before:from-blue-300 before:to-purple-300 before:blur-sm before:opacity-25 before:transition before:duration-300"
      : ""
  }`}
>
      <div
        className={`relative z-10 mb-10 overflow-hidden rounded-xl bg-white px-8 py-10  shadow-[-10px_-15px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.12)] dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-14`}
        data-wow-delay=".1s"
      >
        {product.nickname === "Premium" && (
          <p className="absolute right-[-50px] top-[60px] inline-block -rotate-90 rounded-bl-md rounded-tl-md bg-primary px-5 py-2 text-base cursor-default font-medium text-white">
            Recommended
          </p>
        )}
        <span className="mb-5 block text-xl font-medium text-dark dark:text-white">
          {product.nickname}
        </span>
        <h2 className="mb-11 text-4xl font-semibold text-dark dark:text-white xl:text-[42px] xl:leading-[1.21]">
          <span className="text-xl font-medium">$ </span>
          <span className="-ml-1 -tracking-[2px]">
            {(product.unit_amount / 100).toLocaleString("en-US", {
              currency: "USD",
            })}
          </span>
          <span className="text-base font-normal text-body-color dark:text-dark-6">
            {" "}
            Per Month
          </span>
        </h2>

        <div className="mb-[50px]">
          <h3 className="mb-5 text-lg font-medium text-dark dark:text-white">
            Features
          </h3>
          <div className="mb-10">
            {product?.offers.map((offer, index) => (
               <div key={index} className="flex gap-2">
               <div>
        <BlueTick />
          </div>
              <OfferList text={offer} />
            </div>
             ))}
          </div>
        </div>
        <div className="w-full">
          <button
            onClick={handleSubscription}
            className="inline-block rounded-md bg-primary px-7 py-3 text-center text-base font-medium text-white transition duration-300 hover:bg-primary/90"
          >
            Purchase Now
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};


const BlueTick = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3B82F6" 
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);  

export default PricingBox;
