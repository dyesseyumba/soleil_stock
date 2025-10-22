'use client';

import { Button } from '@/components/ui/button';
import type { Product } from '@/store';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Pencil } from 'lucide-react';

const productColumns = (onEdit: (product: Product) => void): ColumnDef<Product>[] => [
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'nextToExpire',
    header: "Date d'Expiration",
    cell: ({ getValue }) => {
      const rawDate = getValue<string>();
      return rawDate ? format(new Date(rawDate), 'dd MMM yyyy', { locale: fr }) : '';
    },
  },
  {
    accessorKey: 'availableQuantity',
    header: 'Quantité disponible',
    cell: ({ getValue }) => {
      const price = getValue<number>();
      return price ? new Intl.NumberFormat('fr-FR').format(price) : '';
    },
  },
  {
    accessorKey: 'price',
    header: 'Prix',
    cell: ({ getValue }) => {
      const price = getValue<number>();
      return price
        ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(price)
        : '';
    },
  },
  {
    accessorKey: 'totalValue',
    header: 'Valeur Total',
    cell: ({ getValue }) => {
      const price = getValue<number>();
      return price
        ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(price)
        : '';
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const product = row.original;

      return (
        <Button variant="link" size="sm" className="cursor-pointer" onClick={() => onEdit(product)}>
          <Pencil className="h-4 w-4" />
        </Button>
      );
    },
  },
];

export type { Product };
export { productColumns };
