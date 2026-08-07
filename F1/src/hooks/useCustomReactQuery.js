import { useEffect, useState } from "react";
import axios from "axios";

const useCustomReactQuery = (urlPath) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(urlPath);

        console.log("Response:", res.data);

        // Always store an array
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          console.error("API did not return an array:", res.data);
          setProducts([]);
        }
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [urlPath]);

  return { products, loading, error };
};

export default useCustomReactQuery;