"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { createUser } from "@/server/users"
import { User } from "@/db/schema"
//import { useRouter } from "next/router"

// 1. Schéma de validation Zod
const formSchema = z.object({
  username: z.string().min(2, "Minimum 2 caractères").max(50),
  email: z.string().email("Email invalide"),
});

interface UserFormProps {
  user?: User; // Optionnel pour différencier création et édition
}

export default function UserForm() {
    const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // 2. Initialisation du formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  // 3. Soumission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    try {
      // On prépare les données pour Drizzle
      // Note: on ajoute le password ici car il est requis par ton schema.ts
      await createUser({
        username: values.username,
        email: values.email,
        password: "password_temporaire_123", 
      });
      
      form.reset();
      alert("Utilisateur créé !");
      router.refresh();
    } catch (error) {
      console.error("Erreur d'informaticien :", error);
      alert("Erreur lors de la création.");
    } finally {
        
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom d'utilisateur</FormLabel>
                <FormControl>
                  <Input placeholder="Junior" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="junior@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Chargement..." : "Enregistrer"}
          </Button>
        </form>
      </Form>
    </div>
  );
}