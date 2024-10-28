import { prisma } from "@/lib/utils/connect";
import { NextResponse } from "next/server";

// Add this to handle Prisma warm-up
const initPrisma = async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
};

export async function PUT(req: Request) {
  await initPrisma(); // Add this line at the start of your function
  try {
    const { intentId } = await req.json();  // Parsing JSON from request body
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
    await prisma.$disconnect(); // Add disconnect on error
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Add disconnect in finally block
  }
}
