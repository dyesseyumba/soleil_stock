'use client';

import { Button } from '@/components/ui/button';
import type { Sale } from '@/store';
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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const saleColumns = (onEdit: (sale: Sale) => void, onDelete: (sale: Sale) => void): ColumnDef<Sale>[] => [
  {
    accessorKey: 'productName',
    header: 'Produit',
  },
  {
    accessorKey: 'activePrice',
    header: 'Prix Unitaire',
    cell: ({ getValue }) => {
      const price = getValue<number>();
      return price
        ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(price)
        : '';
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Quantité',
    cell: ({ getValue }) => {
      const price = getValue<number>();
      return price ? new Intl.NumberFormat('fr-FR').format(price) : '';
    },
  },

  {
    id: 'totalCost',
    header: 'Prix Total',
    cell: ({ row }) => {
      const { quantity, activePrice } = row.original;
      const total = quantity * Number(activePrice);
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(total);
    },
  },
  {
    accessorKey: 'soldAt',
    header: 'Date de vente',
    cell: ({ getValue }) => {
      const rawDate = getValue<string>();
      return rawDate ? format(new Date(rawDate), 'dd MMM yyyy', { locale: fr }) : '';
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const sale = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button variant="link" size="sm" className="cursor-pointer" onClick={() => onEdit(sale)}>
            <Pencil className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="link" size="sm" className="cursor-pointer text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer la vente</AlertDialogTitle>
                <AlertDialogDescription>
                  Voulez-vous vraiment supprimer la vente de <strong>{sale.productName}</strong> ? Cette
                  action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(sale)}>Supprimer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export { saleColumns };
