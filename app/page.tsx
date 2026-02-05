import UserTable from "@/components/user-table";
import { getUsers } from "@/server/users";
import { User, UserPlus } from "lucide-react";
import{ Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import UserForm from "@/components/forms/user-form";

export const dynamic = "force-dynamic";


export default async function Home() {
     
  
  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto p-4 md:p-24"> 
      <h1 className="text-2xl font-bold">Users list </h1>
      <div className="flex justify-end">
<Dialog>
  <DialogTrigger asChild>
    <Button className="btn btn-primary">Add User <UserPlus className="size-4"/></Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are new user</DialogTitle>
      <DialogDescription>
        <UserForm />
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

        
      </div>
      <UserTable />
    </div>
  );
}

/*
"use client";

import { useState } from "react";
import { loginUser } from "@/server/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserForm from "@/components/UserForm";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await loginUser(email, password);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    // ✅ LOGIN OK → on affiche UserForm
    setIsLoggedIn(true);
    setLoading(false);
  }

  // 🔥 Si connecté, on montre le CRUD User
  if (isLoggedIn) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Bienvenue 👋</h2>
        <UserForm />
      </div>
    );
  }

  // 🔐 Sinon on montre le login
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">Connexion</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
*/