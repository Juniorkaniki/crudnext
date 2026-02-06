"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/server/users";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Loader2 } from "lucide-react";
import DeleteUserButton from "./delete-use-button";
import UserForm from "./forms/user-form";

export default function UserTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Déclare loadUsers à l'extérieur du useEffect pour pouvoir l'appeler depuis d'autres fonctions
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des informaticiens", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Liste des informaticiens enregistrés.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Email</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.email}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>
              {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
            </TableCell>
            <TableCell className="text-right flex justify-end gap-2">
              <Dialog
                open={editingUser === user.id}
                onOpenChange={(open) => setEditingUser(open ? user.id : null)}
              >
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Pencil className="size-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit user</DialogTitle>
                    <UserForm
                      user={user} onSuccess={() => {
                        setEditingUser(null);
                        loadUsers(); // 🔄 rafraîchit la table après édition
                      }}
                    />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <DeleteUserButton
                userId={user.id}
                onSuccess={() => {
                  loadUsers(); // 🔄 rafraîchit la table après suppression
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
