import Header from "./Header";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main style={{ padding: 16 }}>{children}</main>
    </>
  );
}