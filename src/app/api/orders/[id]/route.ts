import { prisma } from "@/lib/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async(req:NextRequest, {params}: {params:{id:string}}) => {
    const {id} = params;

    try {
        const body = await req.json()
        await prisma.order.update({
            where:{
                id:id
            },
            data:{status:body}
            
        })
        return new NextResponse("ORDER HAS BEEN UPDATED", {status:200})

    } catch (error) {
        console.log(error)
        return new NextResponse("Something is wrong", {status:500})
    }

}