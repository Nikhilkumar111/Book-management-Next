import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookSchema } from "@/schemas/book";

type Params = { params: Promise<{ id: string }> }; // 👈 params is async now

/* GET one book */
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;  // ✅ await params
  const book = await prisma.book.findUnique({ where: { id: Number(id) } });

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
  return NextResponse.json(book);
}

/* UPDATE book */
export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;  // ✅ await params
  const body = await req.json();
  const parsed = bookSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
  }

  try {
    const updatedBook = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        ...parsed.data,
        publishedAt: parsed.data.publishedAt
          ? new Date(parsed.data.publishedAt)
          : undefined,
      },
    });
    return NextResponse.json(updatedBook);
  } catch {
    return NextResponse.json({ error: "Book not found or update failed" }, { status: 404 });
  }
}

/* DELETE book */
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;  // ✅ await params
  try {
    await prisma.book.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Book deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
}
