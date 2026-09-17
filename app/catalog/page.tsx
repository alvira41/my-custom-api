async function getProducts() {
  // Ganti URL domain dengan domain app kamu saat diproduksi
  const res = await fetch('http://localhost:3000/api/products', {
    cache: 'no-store', // Selalu ambil data terbaru
  });
  if (!res.ok) throw new Error('Gagal fetching data');
  return res.json();
}
export default async function CatalogPage() {
  const response = await getProducts();
  const products = response.data || [];
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Katalog Produk (Server-Side Fetched)</h1>
      <ul>
        {products.map((item: any) => (
          <li key={item.id}>
            <strong>{item.title}</strong> - Rp {item.price} (Stok: {item.stock})
          </li>
        ))}
      </ul>
    </div>
  );
}