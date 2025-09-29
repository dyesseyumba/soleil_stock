'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  availableQuantity?: number;
  nextToExpire?: Date;
  totalValue?: number;
  createdAt?: Date;
  updatedAt?: Date;
  purchases?: [];
  sales?: [];
  prices?: [];
  StockSummary?: [];
}

const productColumns: ColumnDef<Product>[] = [
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
      const formatted = format(new Date(rawDate), 'dd MMM yyyy', { locale: fr });
      return formatted;
    },
  },
  {
    accessorKey: 'availableQuantity',
    header: 'Quantité disponible',
    cell: ({ getValue }) => {
      const price = getValue<number>();
      return new Intl.NumberFormat('fr-FR').format(price)
    }
  },
  {
    accessorKey: 'price',
    header: 'Prix',
    cell: ({ getValue }) => {
      const price = getValue<number>();
      return new Intl.NumberFormat('fr-FR',{style:'currency', currency:'XAF'}).format(price)
    }
  },
  {
    accessorKey: 'totalValue',
    header: 'Valeur Total',
    cell: ({ getValue }) => {
      const price = getValue<number>();
      return new Intl.NumberFormat('fr-FR',{style:'currency', currency:'XAF'}).format(price)
    }
  },
];

export type { Product };
export { productColumns };
