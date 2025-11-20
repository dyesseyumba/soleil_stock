'use client';

import { Button } from '@/components/ui/button';
import type { Supplier } from '@/store';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const supplierColumns = (
  onEdit: (supplier: Supplier) => void,
  onDelete: (supplier: Supplier) => void
): ColumnDef<Supplier>[] => [
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'contactInfo',
    header: 'Contact',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const supplier = row.original;

      return (
        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <Button
            variant="link"
            size="sm"
            className="cursor-pointer"
            onClick={() => onEdit(supplier)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          {/* Delete Confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="link"
                size="sm"
                className="text-red-600 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer le fournisseur</AlertDialogTitle>
                <AlertDialogDescription>
                  Voulez-vous vraiment supprimer{' '}
                  <strong>{supplier.name}</strong> ?
                  Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(supplier)}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export type { Supplier };
export { supplierColumns };
