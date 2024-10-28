import { prisma } from "@/lib/utils/connect";
import { NextResponse } from "next/server";

// Modify the initPrisma function to be more robust
const initPrisma = async () => {
  try {
    // Check if we're already connected
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection verified");
  } catch (error) {
    console.log("Attempting to reconnect to database...");
    await prisma.$connect();
  }
};

export async function PUT(req: Request) {
  try {
    // Initialize Prisma before any operations
    await initPrisma();
    
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
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Error disconnecting from database:", disconnectError);
    }
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Error disconnecting from database:", disconnectError);
    }
  }
}
