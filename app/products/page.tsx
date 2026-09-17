// app/products/page.tsx

'use client';

import { useState, useEffect } from 'react';

type Product = {
  id: string | number;
  name: string;
  price: number;
  stock: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // =====================================================
  // FORM STATE
  // =====================================================
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  // =====================================================
  // EDIT STATE
  // =====================================================
  const [editingId, setEditingId] = useState<string | number | null>(null);

  // =====================================================
  // 1. READ - AMBIL SEMUA PRODUK
  // =====================================================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/products', {
        cache: 'no-store',
      });

      const json = await res.json();

      if (json.success) {
        setProducts(json.data);
      } else {
        alert('Gagal mengambil data: ' + json.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Terjadi kesalahan saat mengambil data produk.');
    } finally {
      setLoading(false);
    }
  };

  // Jalankan saat halaman pertama kali dibuka
  useEffect(() => {
    fetchProducts();
  }, []);

  // =====================================================
  // 2. CREATE / UPDATE PRODUK
  // =====================================================
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi nama
    if (!name.trim()) {
      alert('Nama produk wajib diisi!');
      return;
    }

    // Validasi harga
    if (!price || Number(price) < 0) {
      alert('Harga produk tidak valid!');
      return;
    }

    // Validasi stok
    if (stock === '' || Number(stock) < 0) {
      alert('Stok produk tidak valid!');
      return;
    }

    try {
      setSubmitting(true);

      // =================================================
      // UPDATE PRODUK
      // =================================================
      if (editingId !== null) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            price: Number(price),
            stock: Number(stock),
          }),
        });

        const json = await res.json();

        if (json.success) {
          alert('Produk berhasil diperbarui!');

          // Reset form
          setName('');
          setPrice('');
          setStock('');
          setEditingId(null);

          // Refresh daftar produk
          await fetchProducts();
        } else {
          alert('Gagal update produk: ' + json.message);
        }

        return;
      }

      // =================================================
      // CREATE PRODUK
      // =================================================
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          stock: Number(stock),
        }),
      });

      const json = await res.json();

      if (json.success) {
        alert('Produk berhasil ditambahkan!');

        // Reset form
        setName('');
        setPrice('');
        setStock('');

        // =================================================
        // PENTING:
        // Ambil ulang data agar produk baru langsung muncul
        // =================================================
        await fetchProducts();
      } else {
        alert('Gagal menambah produk: ' + json.message);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Terjadi kesalahan saat menyimpan produk.');
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // 3. EDIT PRODUK
  // =====================================================
  const handleEditProduct = (item: Product) => {
    setEditingId(item.id);

    setName(item.name);
    setPrice(String(item.price));
    setStock(String(item.stock));

    // Scroll ke atas menuju form
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // =====================================================
  // 4. CANCEL EDIT
  // =====================================================
  const handleCancelEdit = () => {
    setEditingId(null);

    setName('');
    setPrice('');
    setStock('');
  };

  // =====================================================
  // 5. DELETE PRODUK
  // =====================================================
  const handleDeleteProduct = async (id: string | number) => {
    const yakin = confirm(
      'Apakah Anda yakin ingin menghapus produk ini?'
    );

    if (!yakin) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      const json = await res.json();

      if (json.success) {
        alert(json.message);

        // Refresh daftar produk
        await fetchProducts();
      } else {
        alert('Gagal menghapus: ' + json.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Terjadi kesalahan saat menghapus produk.');
    }
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* =====================================================
          JUDUL
      ===================================================== */}
      <h1>📦 Manajemen Produk</h1>

      {/* =====================================================
          FORM TAMBAH / EDIT PRODUK
      ===================================================== */}
      <div
        style={{
          border: '1px solid #ccc',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
        }}
      >
        <h2>
          {editingId !== null
            ? '✏️ Edit Produk'
            : '➕ Tambah Produk Baru'}
        </h2>

        <form
          onSubmit={handleSubmitProduct}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* =================================================
              NAMA PRODUK
          ================================================= */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Nama Produk:
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Nasi Bakar Ayam"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          {/* =================================================
              HARGA & STOK
          ================================================= */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
            }}
          >
            {/* HARGA */}
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Harga (Rp):
              </label>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15000"
                min="0"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </div>

            {/* STOK */}
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Stok:
              </label>

              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                min="0"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
          </div>

          {/* =================================================
              BUTTON
          ================================================= */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
            }}
          >
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px 16px',
                backgroundColor:
                  editingId !== null ? '#f59e0b' : '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: submitting
                  ? 'not-allowed'
                  : 'pointer',
                fontWeight: 'bold',
              }}
            >
              {submitting
                ? 'Menyimpan...'
                : editingId !== null
                ? 'Update Produk'
                : 'Simpan Produk'}
            </button>

            {/* BUTTON BATAL */}
            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#666',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* =====================================================
          DAFTAR PRODUK
      ===================================================== */}
      <h2>Daftar Produk</h2>

      {/* LOADING */}
      {loading ? (
        <p>Memuat data produk...</p>
      ) : products.length === 0 ? (
        /* DATA KOSONG */
        <p>Belum ada produk tersimpan.</p>
      ) : (
        /* ===================================================
           TABLE PRODUK
        =================================================== */
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#f0f0f0',
                textAlign: 'left',
              }}
            >
              <th
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                }}
              >
                Nama Produk
              </th>

              <th
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                }}
              >
                Harga
              </th>

              <th
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                }}
              >
                Stok
              </th>

              <th
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                }}
              >
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                {/* NAMA */}
                <td
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                  }}
                >
                  {item.name}
                </td>

                {/* HARGA */}
                <td
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                  }}
                >
                  Rp {item.price.toLocaleString('id-ID')}
                </td>

                {/* STOK */}
                <td
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                  }}
                >
                  {item.stock}
                </td>

                {/* AKSI */}
                <td
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                    }}
                  >
                    {/* EDIT */}
                    <button
                      onClick={() => handleEditProduct(item)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f59e0b',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        handleDeleteProduct(item.id)
                      }
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#e53e3e',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
