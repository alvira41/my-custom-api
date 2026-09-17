'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

type Params = {
  params: Promise<{ id: string }>;
};

export default function EditProductPage({ params }: Params) {
  const { id } = use(params);
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // =====================================================
  // 1. GET: Ambil Detail Produk
  // =====================================================
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const json = await res.json();

        if (json.success) {
          setName(json.data.name);
          setPrice(String(json.data.price));
          setStock(String(json.data.stock));
        } else {
          alert('Produk tidak ditemukan!');
          router.push('/products');
        }
      } catch (err) {
        console.error('Error fetching detail:', err);
        alert('Terjadi kesalahan saat mengambil data produk.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, router]);

  // =====================================================
  // 2. PUT: Update Produk
  // =====================================================
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Nama produk wajib diisi!');
      return;
    }

    if (!price || Number(price) < 0) {
      alert('Harga produk tidak valid!');
      return;
    }

    if (Number(stock) < 0) {
      alert('Stok tidak boleh negatif!');
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`/api/products/${id}`, {
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
        router.push('/products');
      } else {
        alert('Gagal update: ' + json.message);
      }
    } catch (err) {
      console.error('Error updating:', err);
      alert('Terjadi kesalahan saat memperbarui produk.');
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // Loading
  // =====================================================
  if (loading) {
    return (
      <p
        style={{
          padding: '40px',
          fontFamily: 'sans-serif',
        }}
      >
        Loading detail produk...
      </p>
    );
  }

  // =====================================================
  // UI
  // =====================================================
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'sans-serif',
      }}
    >
      <h1>✏️ Edit Produk #{id}</h1>

      <form
        onSubmit={handleUpdate}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* NAMA */}
        <div>
          <label>Nama Produk:</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Nasi Bakar Ayam"
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '4px',
            }}
          />
        </div>

        {/* HARGA */}
        <div>
          <label>Harga (Rp):</label>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '4px',
            }}
          />
        </div>

        {/* STOK */}
        <div>
          <label>Stok:</label>

          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '4px',
            }}
          />
        </div>

        {/* BUTTON */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '8px',
          }}
        >
          <button
            type="submit"
            disabled={submitting}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#2b6cb0',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting
                ? 'not-allowed'
                : 'pointer',
              fontWeight: 'bold',
            }}
          >
            {submitting ? 'Menyimpan...' : 'Update Produk'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/products')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
