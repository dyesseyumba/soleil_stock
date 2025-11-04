'use client';

import { Button } from '@/components/ui/button';
import type { Product } from '@/store';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Pencil } from 'lucide-react';

const productColumns = (onEdit: (product: Product) => void): ColumnDef<Product>[] => [
  {
    id: 'name',
    header: 'Nom',
    cell: ({ row }) => {
      const product = row.original;

      return (
        <Button variant="link">
          <a href={`products/${product?.id}`}>{product?.name}</a>
        </Button>
      );
    },
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
        <div className="flex items-center gap-2">
          <Button variant="link" size="sm" className="cursor-pointer" onClick={() => onEdit(product)}>
            <Pencil className="h-4 w-4" />
          </Button>

          <Button variant="link" size="sm" className="cursor-pointer text-blue-800">
            <a href={`products/${product?.id}`}><FileText className="h-4 w-4" /></a>
          </Button>
        </div>
      );
    },
  },
];

export type { Product };
export { productColumns };
