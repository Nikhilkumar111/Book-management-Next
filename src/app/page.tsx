// /src/page.tsx
import Books from "./Books/page"; // adjust the path to where your Books component is located
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
          📚 Book Store
        </h1>

        {/* Navigation button to manage books */}
        <div className="flex justify-center mb-6">
          <Link href="/Books/NewBooks">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              ➕ Add / Edit Books
            </button>
          </Link>
        </div>


        {/* Books list component */}
        <Books />
      </div>
    </div>
  );
}
