"use server" // <--- CRUCIAL pour Next.js App Router

import { db } from "@/db/drizzle";
import { User, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// 1. Récupérer tous les utilisateurs
export async function getUsers() {
    try {
        const allUsers = await db.select().from(users);
        return allUsers;
    } catch (error) {
        console.error("failed to get users", error);
        throw error;
    }
}

// 2. Créer un utilisateur
// On utilise Omit pour ignorer les champs auto-générés par Neon
export async function createUser(
  user: Omit<User, "id" | "createdAt" | "updatedAt">
) {
  try {
    // 🔐 Hash du mot de passe avant insertion
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = await db
      .insert(users)
      .values({
        ...user,
        password: hashedPassword, // on remplace le password ici
      })
      .returning();

    revalidatePath("/");
    return newUser[0];
  } catch (error) {
    console.error("failed to create user", error);
    throw error;
  }
}

// 3. Mettre à jour un utilisateur
export async function updateUser( user: Omit<User,  "createdAt" | "updatedAt">) {
    try {
        const updatedUser = await db.update(users)
            .set(user)
            .where(eq(users.id, user.id))
            .returning();
            revalidatePath("/");
        return updatedUser[0];
    } catch (error) {
        console.error("failed to update user", error);
        throw error;
    }
}

// 4. Supprimer un utilisateur
export async function deleteUser(id: string) {
    try {
        const deletedUser = await db.delete(users).where(eq(users.id, id)).returning();
        
        // C'est cette ligne qui évite les erreurs de désynchronisation
    
        revalidatePath("/");
        return deletedUser[0];
    } catch (error) {
        console.error("Erreur serveur :", error);
        throw error;
    }
}