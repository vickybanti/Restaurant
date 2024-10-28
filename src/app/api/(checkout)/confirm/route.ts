import { prisma } from "@/lib/utils/connect";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { intentId } = await req.json();
    console.log("Intent ID received:", intentId);

    if (!intentId) {
      return NextResponse.json(
        { message: "Intent ID is missing" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: {
        intent_id: intentId,
      },
      data: { status: "Being prepared" },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    console.log("Order updated:", order);

    return NextResponse.json(
      { message: "Order has been updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in updating order:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
