import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

function ProductDetailsPage() {
  return (
    <>
      <PageHeader>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Produit</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Détail du Produit</BreadcrumbPage>
        </BreadcrumbItem>
      </PageHeader>

      <div className="flex flex-col gap-6 p-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">Nom du Produit</h3>
          {/* <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
            Modifier
          </button> */}
          <Button>Modifier le produit</Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="rounded bg-gray-200 p-6 text-center shadow">
            <p className="text-3xl font-semibold">10</p>
            <p className="text-sm text-gray-600">Quantité Disponible</p>
          </div>
          <div className="rounded bg-gray-200 p-6 text-center shadow">
            <p className="text-3xl font-semibold">100 FCFA</p>
            <p className="text-sm text-gray-600">Prix</p>
          </div>
          <div className="rounded bg-gray-200 p-6 text-center shadow">
            <p className="text-3xl font-semibold">1000 FCFA</p>
            <p className="text-sm text-gray-600">Valeur Total</p>
          </div>

          <div className="rounded bg-gray-200 p-6 text-center shadow">
            <p className="text-3xl font-semibold">25 Janv. 2026</p>
            <p className="text-sm text-gray-600">Date d'Expiration</p>
          </div>
        </div>

        <div className="rounded border bg-white p-4">
          <p className="text-gray-700">
            Ces chiffres représentent les performances du mois dernier. Le taux de satisfaction est en hausse,
            et le délai moyen de réponse reste stable.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Historique des prix</h2>

          <Button size="sm" onClick={() => console.log('open add price modal')}>
            <PlusCircle className="mr-1 h-4 w-4" /> Nouveau prix
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Prix</th>
                <th className="border px-4 py-2 text-left">Date effective</th>
                <th className="border px-4 py-2 text-left">Statut</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">100</td>
                <td className="border px-4 py-2">30 Oct. 2025</td>
                <td className="border px-4 py-2 text-green-600">Actif</td>
                <td className="border px-4 py-2">Modifier</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">90</td>
                <td className="border px-4 py-2">19 Dec. 2025</td>
                <td className="border px-4 py-2 text-red-600">Inactif</td>
                <td className="border px-4 py-2">Modifier</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export { ProductDetailsPage };
