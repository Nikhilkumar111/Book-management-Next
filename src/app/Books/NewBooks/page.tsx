"use client";
import { useState } from "react";
import Link from "next/link";

export default function ManageBooks() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    genre: "",
    publishedAt: "",
  });
  const [errors, setErrors] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
      ...form,
      price: Number(form.price),
      publishedAt: form.publishedAt || undefined,
    };

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      // after fetching the complete data wait using await keyword 

      const data = await res.json();
      //error and set error useState used for this 
      if (!res.ok) {
 setErrors(data.errors || { general: data.error });
      }else {
        setSuccessMsg("Book added successfully!");
        setErrors(null);
        setForm({ title: "", author: "", price: "", genre: "", publishedAt: "" });
        setTimeout(() => setSuccessMsg(null), 2000);
      }

    } 
    catch (err) {
     
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          📚 Add New Book
        </h1>

        {successMsg && (
          <div className="text-green-500 my-2 p-2 border border-green-300 rounded">
            {successMsg}
          </div>
        )}

        {errors && (
          <div className="text-red-500 my-4 text-sm">
            {Object.entries(errors).map(([key, value]: any) => (
              <p key={key}>{key}: {value._errors?.join(", ") || value}</p>
            ))}
          </div>
        )}

        <form onSubmit={submitForm} className="space-y-3 flex flex-col items-center">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg p-2" />
          <input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full border rounded-lg p-2" />
          <input placeholder="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="w-full border rounded-lg p-2" />
          <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border rounded-lg p-2" />
          <input type="date" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} className="w-full border rounded-lg p-2" />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            ➕ Add Book
          </button>

        </form>
                {/* <div className="flex justify-center mb-6"> */}
              <Link href="/">
        <button className="w-30 bg-blue-500 text-white my-2 rounded-lg hover:bg-orange-600 transition m-30">All books</button>
              </Link>
                {/* </div> */}
      </div>
    </div>
  );
}
