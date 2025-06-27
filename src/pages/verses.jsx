import { useEffect, useState } from "react";
import axios from "axios";

export default function VersesPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get("/api/scripture").then((res) => setBooks(res.data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Scripture Browser</h1>
      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
        {books.map((book, i) => (
          <li key={i}>{book.name}</li>
        ))}
      </ul>
    </div>
  );
}
