import React, { useState, useEffect } from "react";

// Debounce Hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value]);

  return debounced;
}

// LocalStorage Hook
function useLocalStorage(key, initialValue) {
  const [val, setVal] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val));
  }, [val]);

  return [val, setVal];
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useLocalStorage("search", "");

  const debouncedSearch = useDebounce(search, 500);

  // Fetch data
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  // Filter
  const filtered = products.filter((item) =>
    item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product Search</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={() => setSearch("")}>Clear</button>

      {/* Cards */}
      <div>
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid black",
                margin: "10px",
                padding: "10px",
              }}
            >
              <h4>{item.name}</h4>
              <p>{item.description}</p>
            </div>
          ))
        ) : (
          <p>No Results Found</p>
        )}
      </div>
    </div>
  );
}