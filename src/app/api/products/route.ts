import { prisma } from "@/lib/utils/connect";
import { NextRequest, NextResponse } from "next/server";


//FECTH ALL CATEGORIES
export const GET = async(req:NextRequest) => {
    const {searchParams} = new URL(req.url)
    const cat = searchParams.get("cat")
    const page = searchParams.get("page") || "1"
    const limit = searchParams.get("limit") || "6"

    try {
        const products = await prisma.product.findMany({
            where:{
                ...(cat && {catSlug:cat})
            },
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
        })

        // Get total count for pagination
        const count = await prisma.product.count({
            where:{
                ...(cat && {catSlug:cat})
            }
        })

        return new NextResponse(
            JSON.stringify({
                products,
                count,
                hasMore: parseInt(page) * parseInt(limit) < count
            }),
            {status:200}
        )
    } catch (error) {
        console.log(error)
        return new NextResponse(
            JSON.stringify("Somethong went wrong"), 
            {status:200})

    }

}



export const POST = async(req:NextRequest) => {
   

    try {
        const body = await req.json()
        console.log(body)
        const product = await prisma.product.create({
            data:body,
        })
        return new NextResponse(JSON.stringify(product),{status:201})
    } catch (error) {
        console.log(error)
        return new NextResponse(
            JSON.stringify("Somethong went wrong"), 
            {status:200})

    }

}
