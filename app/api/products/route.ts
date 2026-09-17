import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { corsHeaders, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";

// =========================
// OPTIONS
// =========================
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// =========================
// GET ALL PRODUCTS
// =========================
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, name, price, stock")
      .order("id", { ascending: true });

    if (error) {
      console.error("GET /api/products error:", error);

      return withCors(
        NextResponse.json(
          {
            success: false,
            message: "Gagal mengambil data produk",
            error_message: error.message,
            error_code: error.code,
          },
          { status: 500 }
        )
      );
    }

    return withCors(
      NextResponse.json(
        {
          success: true,
          count: data?.length ?? 0,
          data: data ?? [],
        },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("GET ERROR:", error);

    return withCors(
      NextResponse.json(
        {
          success: false,
          message: "Terjadi kesalahan pada server",
        },
        { status: 500 }
      )
    );
  }
}

// =========================
// POST CREATE PRODUCT
// =========================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name;
    const price = body.price;
    const stock = body.stock ?? 0;

    // =========================
    // VALIDASI NAMA
    // =========================
    if (
      !name ||
      typeof name !== "string" ||
      name.trim().length === 0
    ) {
      return withCors(
        NextResponse.json(
          {
            success: false,
            message: 'Field "name" wajib diisi',
          },
          { status: 400 }
        )
      );
    }

    // =========================
    // VALIDASI HARGA
    // =========================
    if (
      price === undefined ||
      price === null ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return withCors(
        NextResponse.json(
          {
            success: false,
            message:
              'Field "price" harus berupa angka dan tidak boleh negatif',
          },
          { status: 400 }
        )
      );
    }

    // =========================
    // VALIDASI STOK
    // =========================
    if (
      typeof stock !== "number" ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return withCors(
        NextResponse.json(
          {
            success: false,
            message:
              'Field "stock" harus berupa bilangan bulat dan tidak boleh negatif',
          },
          { status: 400 }
        )
      );
    }

    // =========================
    // INSERT SUPABASE
    // =========================
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        name: name.trim(),
        price: price,
        stock: stock,
      })
      .select("id, name, price, stock")
      .single();

    if (error) {
      console.error("POST /api/products error:", error);

      return withCors(
        NextResponse.json(
          {
            success: false,
            message: "Gagal menambahkan produk",
            error_message: error.message,
            error_code: error.code,
          },
          { status: 500 }
        )
      );
    }

    // =========================
    // SUCCESS
    // =========================
    return withCors(
      NextResponse.json(
        {
          success: true,
          message: "Produk berhasil dibuat",
          data: data,
        },
        { status: 201 }
      )
    );
  } catch (error) {
    console.error("POST ERROR:", error);

    return withCors(
      NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body",
        },
        { status: 400 }
      )
    );
  }
}