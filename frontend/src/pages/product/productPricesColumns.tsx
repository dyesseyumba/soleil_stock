'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ProductPrice } from '@/store';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Pencil } from 'lucide-react';

const productPricesColumns = (onEdit: (productPrice: ProductPrice) => void): ColumnDef<ProductPrice>[] => [
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
    accessorKey: 'effectiveAt',
    header: 'Date Effective',
    cell: ({ getValue }) => {
      const rawDate = getValue<string>();
      return rawDate ? format(new Date(rawDate), 'dd MMM yyyy', { locale: fr }) : '';
    },
  },
  {
    accessorKey: 'status',
    header: 'status',
    cell: ({ getValue }) => {
      const status = getValue<string>();

      return (
        <Badge
          className={
            status === 'Actif' ? 'bg-green-700 text-white' : 'bg-muted text-muted-foreground capitalize'
          }
        >
          {status}
        </Badge>
      );
    },
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const productPrice = row.original;

      return (
        <Button variant="link" size="sm" className="cursor-pointer" onClick={() => onEdit(productPrice)}>
          <Pencil className="h-4 w-4" />
        </Button>
      );
    },
  },
];

export { productPricesColumns };
