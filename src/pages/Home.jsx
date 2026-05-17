import { useState, useEffect } from "react";
import Products from "./Products";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // 🔹 Fetch products from DummyJSON
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("https://dummyjson.com/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Serverdən cavab alınmadı (Şəbəkə xətası)");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.products) {
          setProducts(data.products);
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error("Məlumat formatı düzgün deyil");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Xəta yarandı:", err);
        setError(err.message); // Xətanı state-ə yazırıq ki ekranda görünsün
        setLoading(false);
      });
  }, []);

  // 🔹 Filtered products (Təhlükəsiz filter)
  const filteredProducts = products.filter((product) => {
    if (!product) return false;

    // Əgər title yoxdursa boş string qəbul edirik ki .toLowerCase() xəta verməsin
    const title = product.title || "";
    const productCategory = product.category || "";

    const matchesSearch = title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      category === "all" || 
      productCategory.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // 🔹 Cart functions
  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

  const decreaseQuantity = (id) =>
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Cart LocalStorage Sync
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Ekran Vəziyyətləri
  if (loading) return <h2 style={{ padding: "20px" }}>Loading... (Məhsullar yüklənir)</h2>;
  if (error) return <h2 style={{ padding: "20px", color: "red" }}>Error: {error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      {/* Search + Category */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "5px" }}
        >
          <option value="all">All</option>
          <option value="smartphones">Smartphones</option>
          <option value="laptops">Laptops</option>
          <option value="fragrances">Fragrances</option>
          <option value="skincare">Skincare</option>
          <option value="beauty">Beauty</option>
        </select>
      </div>

      {/* Products Grid */}
      <Products products={filteredProducts} addToCart={addToCart} />

      {/* Cart Section */}
      <div style={{ marginTop: "20px" }}>
        <div
          style={{ cursor: "pointer", marginBottom: "10px", fontWeight: "bold" }}
          onClick={() => setShowCart(!showCart)}
        >
          🛒 Cart ({totalItems})
        </div>

        {showCart && (
          <div
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            {cart.length === 0 ? (
              <p>Cart is empty</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={item.thumbnail} width="40" alt={item.title} />
                    <span>
                      {item.title && item.title.length > 30
                        ? item.title.slice(0, 30) + "..."
                        : item.title}
                    </span>
                    <span style={{ fontSize: "16px", color: "green", fontWeight: "bold" }}>
                      ${item.price}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <button onClick={() => decreaseQuantity(item.id)}>➖</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)}>➕</button>
                  </div>
                </div>
              ))
            )}
            <button onClick={() => setCart([])} style={{ marginTop: "10px" }}>
              Clear Cart
            </button>
          </div>
        )}

        <h3>Total: ${totalPrice.toFixed(2)}</h3>
      </div>
    </div>
  );
}