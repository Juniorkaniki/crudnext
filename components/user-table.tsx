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
} from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react";
import DeleteUserButton from "./delete-use-button";
//import DeleteUserButton from "./delete-use-button";


export default async function UserTable() {
    const users = await getUsers();

    return(
       <Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
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
        <TableCell>{user.createdAt?.toLocaleString() }</TableCell>
        <TableCell className="text-right">
            <Button variant="ghost" size="sm"><Pencil className="size-4"/></Button>
            <DeleteUserButton userId={user.id}/>
           </TableCell>
      </TableRow>

    ))}
  </TableBody>
</Table> 
    );
}