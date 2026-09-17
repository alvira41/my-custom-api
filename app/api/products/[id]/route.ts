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
// GET PRODUCT BY ID
// =========================
export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return withCors(
        NextResponse.json(
          {
            success: false,
            message: "ID produk tidak valid",
          },
          { status: 400 }
        )
      );
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, name, price, stock")
      .eq("id", productId)
      .single();

    if (error) {
      return withCors(
        NextResponse.json(
          {
            success: false,
            message: "Produk tidak ditemukan",
            error_message: error.message,
            error_code: error.code,
          },
          { status: 404 }
        )
      );
    }

    return withCors(
      NextResponse.json(
        {
          success: true,
          data,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error(error);

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
// PUT UPDATE PRODUCT
// =========================
export async function PUT(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return withCors(
        NextResponse.json(
          {
            success: false,
            message: "ID produk tidak valid",
          },
          { status: 400 }
        )
      );
    }

    const body = await request.json();

    const name = body.name;
    const price = body.price;
    const stock = body.stock;

    // Validasi nama
    if (!name || typeof name !== "string") {
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

    // Validasi harga
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
            message: 'Field "price" harus berupa angka',
          },
          { status: 400 }
        )
      );
    }

    // Validasi stok
    if (
      stock === undefined ||
      typeof stock !== "number" ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return withCors(
        NextResponse.json(
          {
            success: false,
            message: 'Field "stock" harus berupa bilangan bulat',
          },
          { status: 400 }
        )
      );
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .update({
        name: name.trim(),
        price,
        stock,
      })
      .eq("id", productId)
      .select("id, name, price, stock")
      .single();

    if (error) {
      console.error("PUT /api/products/[id] error:", error);

      return withCors(
        NextResponse.json(
          {
            success: false,
            message: "Gagal mengubah produk",
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
          message: "Produk berhasil diubah",
          data,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error(error);

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

// =========================
// DELETE PRODUCT
// =========================
export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return withCors(
        NextResponse.json(
          {
            success: false,
            message: "ID produk tidak valid",
          },
          { status: 400 }
        )
      );
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", productId)
      .select("id, name, price, stock")
      .single();

    if (error) {
      console.error("DELETE /api/products/[id] error:", error);

      return withCors(
        NextResponse.json(
          {
            success: false,
            message: "Gagal menghapus produk",
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
          message: "Produk berhasil dihapus",
          data,
        },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error(error);

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