import { useState } from "react";
import "./App.css";
import useCustomReactQuery from "./hooks/useCustomReactQuery";

function App() {
  const [search, setSearch] = useState("");

  const { products, loading, error } = useCustomReactQuery(
    `/api/products?search=${search}`
  );

  if (loading) {
    return <h1>Loading Products...</h1>;
  }

  if (error) {
    return (
      <>
        <h1>Error Fetching Products</h1>
        <p>{error.message}</p>
      </>
    );
  }

  return (
    <>
      <h1>SK is the GOD</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      />

      <h2>Number of Products: {products.length}</h2>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{product.name}</h3>
          <p>Price: ₹{product.price}</p>
          <p>{product.description}</p>
        </div>
      ))}
    </>
  );
}

export default App;