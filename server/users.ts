"use server" // <--- CRUCIAL pour Next.js App Router

import { db } from "@/db/drizzle";
import { User, users } from "@/db/schema";
import { eq } from "drizzle-orm";

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
export async function createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
        const newUser = await db.insert(users)
            .values(user)
            .returning(); // Renvoie un tableau avec l'utilisateur créé
        return newUser[0];
    } catch (error) {
        console.error("failed to create user", error);
        throw error;
    }
}

// 3. Mettre à jour un utilisateur
export async function updateUser(id: string, user: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>) {
    try {
        const updatedUser = await db.update(users)
            .set(user)
            .where(eq(users.id, id))
            .returning();
        return updatedUser[0];
    } catch (error) {
        console.error("failed to update user", error);
        throw error;
    }
}

// 4. Supprimer un utilisateur
export async function deleteUser(id: string) { 
    try {
        await db.delete(users)
            .where(eq(users.id, id))
            .returning();
        
    } catch (error) {
        console.error("failed to delete user", error);
        throw error;
    }
}