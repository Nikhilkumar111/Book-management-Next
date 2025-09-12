"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditBookPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>(); // ✅ get book ID from route

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    genre: "",
    publishedAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch book by ID
  useEffect(() => {
    if (!id) return; // safeguard

    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${id}`);
        if (!res.ok) throw new Error("Book not found");
        const data = await res.json();
        setForm({
          title: data.title,
          author: data.author,
          price: data.price.toString(),
          genre: data.genre,
          publishedAt: data.publishedAt?.split("T")[0] || "",
        });
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // Submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          publishedAt: form.publishedAt || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Update failed");
        return;
      }

      router.push("/"); // ✅ go back to book list
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-yellow-600">
          ✏️ Edit Book
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3 flex flex-col items-center">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded-lg p-2"
          />
          <input
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full border rounded-lg p-2"
          />
          <input
            placeholder="Genre"
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
            className="w-full border rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full border rounded-lg p-2"
          />
          <input
            type="date"
            value={form.publishedAt}
            onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
            className="w-full border rounded-lg p-2"
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            ✅ Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
