// src/app/api/books/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookSchema } from "@/schemas/book";

// GET all books
// very easy crud operations will be performed in this 
// next js and prisma combination 


export async function GET() {
  try {
    const books = await prisma.book.findMany();
    return NextResponse.json(books, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

// POST create a new book
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body using Zod
    const parsed = bookSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
    }

    // Create book in the database
 const book = await prisma.book.create({
  data: {
    ...parsed.data,
    publishedAt: parsed.data.publishedAt 
      ? new Date(parsed.data.publishedAt) 
      : undefined,
  },
});


    return NextResponse.json(book, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
