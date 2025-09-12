"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  genre: string;
  publishedAt: string;
};

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);

 
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>(null);

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Delete book
  const deleteBook = async (id: number) => {
    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccessMsg("Book deleted successfully!");
        fetchBooks();
        setTimeout(() => setSuccessMsg(null), 2000);
      } else {
        const data = await res.json();
        setErrors({ general: data.error || "Failed to delete book" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          📖 Available Books
        </h1>

        {/* Success & Error Messages */}
        {successMsg && (
          <div className="text-green-500 my-2 p-2 border border-green-300 rounded">
            {successMsg}
          </div>
        )}
        {errors && (
          <div className="text-red-500 my-2 p-2 border border-red-300 rounded">
            {Object.entries(errors).map(([key, value]: any) => (
              <p key={key}>
                {key}: {value._errors?.join(", ") || value}
              </p>
            ))}
          </div>
        )}

       


        {/* Book List */}
        <ul className="space-y-3">
          
          {books.map((b) => (
            <li key={b.id} className="flex justify-between items-center border p-3 rounded-lg shadow-sm">
              <div>
                <b className="text-blue-700">{b.title}</b>{" "}
                <span className="text-gray-600">
                  by {b.author} (${b.price})
                </span>
              </div>
              <div className="flex gap-2">
           <Link href={`/Books/${b.id}/Edit`}>
  <button
    className="px-2 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
  >
    ✏️ Edit
  </button>
</Link>
                <button
                  onClick={() => deleteBook(b.id)}
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
