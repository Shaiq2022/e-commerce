import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ padding: 16, borderBottom: "1px solid #ddd" }}>
      <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
      </nav>
    </header>
  );
}