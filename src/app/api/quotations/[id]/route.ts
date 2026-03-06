import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Quotation from "@/models/Quotation";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();
    const id = await Promise.resolve(params.id);
    console.log("Looking up quotation with ID:", id);

    // Try finding by MongoDB _id (if it's a valid ObjectId) OR by the custom string 'id'
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { $or: [{ _id: id }, { id: id }] } : { id: id };

    const quotation = await Quotation.findOne(query);

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(quotation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { status } = await request.json();
    await dbConnect();
    const id = await Promise.resolve(params.id);

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { $or: [{ _id: id }, { id: id }] } : { id: id };

    const quotation = await Quotation.findOneAndUpdate(
      query,
      { status },
      { new: true },
    );

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(quotation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
