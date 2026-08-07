import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/api/products", (req, res) => {
  const products = [
    {
      id: 1,
      name: "Product 1",
      price: 10,
      description: "This is product 1",
    },
    {
      id: 2,
      name: "Product 2",
      price: 20,
      description: "This is product 2",
    },
    {
      id: 3,
      name: "Product 3",
      price: 30,
      description: "This is product 3",
    },
  ];

  if (req.query.search) {
    const search = req.query.search.toLowerCase();

    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(search)
    );

    return res.json(filteredProducts);
  }

  setTimeout(() => {
    res.json(products);
  }, 1000);
});

app.listen(3000, () => {
  console.log("Server Running on http://localhost:3000");
});