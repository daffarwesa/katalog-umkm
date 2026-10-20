"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/session";

export async function login(prevStateOrFormData, maybeFormData) {
  let formData;
  if (maybeFormData instanceof FormData) {
    formData = maybeFormData;
  } else if (prevStateOrFormData instanceof FormData) {
    formData = prevStateOrFormData;
  } else {
    formData = maybeFormData || prevStateOrFormData;
  }

  const email = formData?.get("email");
  const password = formData?.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email).trim(),
    password: String(password),
  });

  if (error) {
    const pesan =
      error.message === "Invalid login credentials"
        ? "Email atau password salah."
        : error.message || "Gagal masuk. Periksa kembali email dan password.";
    return { error: pesan };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export const keluar = logout;

export async function gantiPassword(prevStateOrFormData, maybeFormData) {
  let formData;
  if (maybeFormData instanceof FormData) {
    formData = maybeFormData;
  } else if (prevStateOrFormData instanceof FormData) {
    formData = prevStateOrFormData;
  } else {
    formData = maybeFormData || prevStateOrFormData;
  }

  const passwordBaru = formData?.get("password_baru");
  const konfirmasiPassword = formData?.get("konfirmasi_password");

  if (!passwordBaru || typeof passwordBaru !== "string" || passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak sama dengan password baru." };
  }

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Anda harus masuk terlebih dahulu untuk mengganti password." };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (updateError) {
    return {
      error: updateError.message || "Gagal mengganti password.",
    };
  }

  return {
    success: true,
    message: "Password berhasil diperbarui.",
  };
}
