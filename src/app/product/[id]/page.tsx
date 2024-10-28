"use client"
import DeletButton from "@/components/DeleteButton";
import Price from "@/components/Price";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductType } from "@/types/types";
import Image from "next/image";
import React, { useState } from "react";


const getData = async(id:string) => {
  const res = await fetch(`http://localhost:3000/api/products/${id}`,{
    cache:"no-store",

  })
  if(!res.ok){
    throw new Error("failed")
  }
  console.log(res)
  return res.json()
}

const SingleProductPage = async({params}:{params:{id:string}}) => {

  const singleProduct:ProductType = await getData(params.id)
  console.log(singleProduct.id)

  const [loading,setLoading] = useState(false)
  
  return (
    <div className="p-4 mt-14 lg:px-20 xl:px-40 h-screen flex flex-col justify-around text-red-500 md:flex-row md:gap-8 md:items-center relative" key={singleProduct.id}>
      {/* IMAGE CONTAINER */}
      
      {singleProduct.img && (
        <div className="relative w-full h-1/2 md:h-[70%]">
          {loading && (<Skeleton className="h-full w-full"/>)}
          <Image
            src={singleProduct.img}
            alt=""
            className="object-contain"
            fill
          />
        </div>
      )}
      {/* TEXT CONTAINER */}
      <div className="pr-12 h-1/2 flex flex-col gap-4 md:h-[70%] md:justify-center md:gap-6 xl:gap-8">
        {loading && (<Skeleton className="h-4 w-4"/>)}
        <h1 className="text-3xl font-bold uppercase xl:text-5xl text-black ">{singleProduct.title}</h1>
        <p className="text-gray-800">{singleProduct.desc}</p>
        <Price product={singleProduct}/>
      </div>
      <DeletButton id={singleProduct.id}/>
    </div>
  );
};

export default SingleProductPage;
