export default function Products({ products, addToCart }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
      }}
    >
      {products.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <h3>{item.title}</h3>
          <p>${item.price}</p>
          <img src={item.thumbnail} alt={item.title} width="100%" />
          <button
            style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}
            onClick={() => addToCart(item)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}