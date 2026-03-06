import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Quotation from "@/models/Quotation";

export async function GET() {
  try {
    await dbConnect();
    const quotations = await Quotation.find({}).sort({ createdAt: -1 });
    return NextResponse.json(quotations);
  } catch (error: any) {
    console.error("Database Error (GET /api/quotations):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const quotation = await Quotation.create(body);
    return NextResponse.json(quotation, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
