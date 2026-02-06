"use client";

import { useState } from "react";
import { loginUser } from "@/server/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";

// Imports pour le Dialog et le CRUD
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserForm from "@/components/forms/user-form";
import UserTable from "@/components/user-table";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); // Pour fermer la modale
  const [refreshKey, setRefreshKey] = useState(0); // Pour rafraîchir la table

  const handleUserAdded = () => {
    console.log("L'ajout a réussi !"); // Ajoute ce log pour tester
    setIsAddDialogOpen(false); // ✅ Ferme la modale
    setRefreshKey(prev => prev + 1); // ✅ Change la clé pour trigger le useEffect de la table
  };
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(email, password);

      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      // ✅ LOGIN OK
      setIsLoggedIn(true);
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  }

  // 🔥 VUE APRES LOGIN : Ton code de gestion des informaticiens
  if (isLoggedIn) {
  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto p-4 md:p-24">
      <h1 className="text-2xl font-bold">Users list</h1>

      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="btn btn-primary">
              Add User <UserPlus className="size-4 ml-2" />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new user</DialogTitle>
              <DialogDescription>
                <UserForm onSuccess={handleUserAdded} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        
      </div>

      <UserTable />
    </div>
  );
}


  // 🔐 VUE PAR DÉFAUT : Formulaire de connexion
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-4 border">
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

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <Button className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}