// app/api/products/[id]/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// ==========================================
// GET: Ambil Detail 1 Produk
// ==========================================
export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID produk wajib diisi",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, name, price, stock")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("GET product by ID error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Produk tidak ditemukan",
          error_message: error?.message ?? null,
          error_code: error?.code ?? null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// PUT: Update Produk
// ==========================================
export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID produk wajib diisi",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const name = body.name;
    const price = body.price;
    const stock = body.stock;

    // ==========================================
    // Validasi nama
    // ==========================================
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        {
          success: false,
          message:
            'Field "name" wajib diisi dan harus berupa text',
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Validasi harga
    // ==========================================
    if (
      price === undefined ||
      price === null ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Field "price" wajib berupa angka dan tidak boleh negatif',
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Validasi stock
    // ==========================================
    if (
      typeof stock !== "number" ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Field "stock" harus berupa bilangan bulat dan tidak boleh negatif',
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Update Supabase
    // ==========================================
    const { data, error } = await supabaseAdmin
      .from("products")
      .update({
        name: name.trim(),
        price,
        stock,
      })
      .eq("id", id)
      .select("id, name, price, stock")
      .single();

    if (error || !data) {
      console.error("PUT product error:", error);

      return NextResponse.json(
        {
          success: false,
          message:
            "Gagal update atau produk tidak ditemukan",
          error_message: error?.message ?? null,
          error_code: error?.code ?? null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Produk berhasil diperbarui!",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Invalid Request Body",
      },
      { status: 400 }
    );
  }
}

// ==========================================
// DELETE: Hapus Produk
// ==========================================
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID produk wajib diisi",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Hapus dari Supabase
    // ==========================================
    const { data, error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id)
      .select("id, name, price, stock")
      .single();

    if (error || !data) {
      console.error("DELETE product error:", error);

      return NextResponse.json(
        {
          success: false,
          message:
            "Produk tidak ditemukan atau gagal dihapus",
          error_message: error?.message ?? null,
          error_code: error?.code ?? null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Produk berhasil dihapus!",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "DELETE /api/products/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}