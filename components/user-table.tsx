"use client";

import { useEffect, useState } from "react"; // Ajout des hooks
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
import { Pencil, Loader2 } from "lucide-react";
import DeleteUserButton from "./delete-use-button";

// On retire le "async" de la fonction principale
export default function UserTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // On gère la récupération des données au montage du composant
  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des informaticiens", error);
      } finally {
        setLoading(false);
      }
    }
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
              <Button variant="ghost" size="sm">
                <Pencil className="size-4" />
              </Button>
              <DeleteUserButton userId={user.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}