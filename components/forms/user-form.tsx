"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { use, useState } from "react"
import { useRouter } from "next/navigation"
import {  users } from "@/db/schema";

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
import { createUser, updateUser } from "@/server/users"
import { User } from "@/db/schema"

// 1. Schéma de validation Zod
const formSchema = z.object({
  username: z.string().min(2, "Minimum 2 caractères").max(50),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"), 
});

interface UserFormProps {
  user?: User; // Optionnel pour différencier création et édition
}

export default function UserForm({user}: UserFormProps) {
  
  const [isPending, setIsPending] = useState(false);

  // 2. Initialisation du formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user ? user.username || "" : "",
      email: user ? user.email || "" : "",
      password: user ? "" : "", // On ne pré-remplit pas le password en édition
      },
  });
const router = useRouter();
  // 3. Soumission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    try {
      // On envoie maintenant les "values" qui contiennent le password
      if(user){
        await updateUser({
          ...values,
          id: user.id, // On a besoin de l'ID pour la mise à jour
        }); 
      } else {
        await createUser(values);
      } 
      
      form.reset();
      alert("Utilisateur créé avec succès !");
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
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