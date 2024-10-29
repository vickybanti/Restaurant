import { prisma } from "@/lib/utils/connect";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  let prismaClient = prisma;
  
  try {
    // Add connection timeout and retry logic
    const MAX_RETRIES = 3;
    let retryCount = 0;
    
    while (retryCount < MAX_RETRIES) {
      try {
        await prismaClient.$connect();
        break;
      } catch (connError) {
        retryCount++;
        if (retryCount === MAX_RETRIES) {
          throw new Error(`Failed to connect to database after ${MAX_RETRIES} attempts`);
        }
        // Wait for 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const { intentId } = await req.json();
    console.log("Intent ID received:", intentId);  

    if (!intentId) {
      return NextResponse.json(
        { message: "Intent ID is missing" },
        { status: 400 }
      );
    }

    const order = await prismaClient.order.update({
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
    
    // Enhanced error handling
    if (error instanceof Error) {
      if (error.message.includes('connect ECONNREFUSED')) {
        return NextResponse.json(
          { message: "Database connection refused. Please ensure the database server is running." },
          { status: 503 }
        );
      } else if (error.message.includes('prisma')) {
        return NextResponse.json(
          { message: "Database error", error: error.message },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    try {
      await prismaClient.$disconnect();
    } catch (e) {
      console.error("Error disconnecting from database:", e);
    }
  }
}
