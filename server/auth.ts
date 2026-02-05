"use server";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function loginUser(email: string, password: string) {
  try {
    // 🔍 On cherche l'utilisateur par email
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = result[0];

    if (!user) {
      return { error: "Email introuvable" };
    }

    // 🔐 Comparaison du mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: "Mot de passe incorrect" };
    }

    return { success: true, userId: user.id };

  } catch (error) {
    console.error("Erreur login:", error);
    return { error: "Erreur serveur" };
  }
}

