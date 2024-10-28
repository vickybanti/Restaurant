import { prisma } from "@/lib/utils/connect";
import { NextResponse } from "next/server";


//FECTH ALL CATEGORIES
export const GET = async() => {

    try {
        const allCategories = await prisma.category.findMany()
        return new NextResponse(JSON.stringify(allCategories))
    } catch (error) {
        console.log(error)
        return new NextResponse(
            JSON.stringify("Somethong went wrong"), 
            {status:200})

    }
    return new NextResponse("Hello", {status:200})

}

export const POST =() => {
    return new NextResponse("Hello", {status:200})

}