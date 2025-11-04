import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate, useParams } from 'react-router';

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // const { data: product, isLoading: loadingProduct } = useProductById(id!)
  // const { data: prices = [], isLoading: loadingPrices } = useProductPrices(id!)

  // const currentPrice = useMemo(() => {
  //   if (!prices.length) return null
  //   return prices[0] // Assuming API returns sorted descending by date
  // }, [prices])

  // if (loadingProduct) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <Spinner className="mr-2" /> Chargement du produit...
  //     </div>
  //   )
  // }

  // if (!product) {
  //   return (
  //     <div className="text-center mt-10">
  //       <p className="text-gray-600">Produit introuvable.</p>
  //       <Button variant="outline" className="mt-3" onClick={() => navigate('/products')}>
  //         Retour
  //       </Button>
  //     </div>
  //   )
  // }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Retour
          </Button>
          {/* <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1> */}
        </div>
        <Button onClick={() => navigate(`/products/edit/${id}`)}>Modifier le produit</Button>
      </div>

      <Separator />

      {/* Tabs Section */}
      {/* <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:inline-flex sm:w-auto">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="prices">Historique des prix</TabsTrigger>
        </TabsList> */}

        {/* Informations */}
        {/* <TabsContent value="info"> */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Détails du produit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-medium text-gray-800">Nom du produit</p>
                  {/* <p className="text-gray-600">{product.name}</p> */}
                </div>
                <div>
                  <p className="font-medium text-gray-800">Description</p>
                  {/* <p className="text-gray-600">{product.description || 'Aucune description'}</p> */}
                </div>
                <div>
                  <p className="font-medium text-gray-800">Date de création</p>
                  <p className="text-gray-600">
                    {/* {format(new Date(product.createdAt), 'dd MMMM yyyy', { locale: fr })} */}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Dernière mise à jour</p>
                  <p className="text-gray-600">
                    {/* {format(new Date(product.updatedAt), 'dd MMMM yyyy', { locale: fr })} */}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="font-medium text-gray-800">Prix actuel</p>
                {/* {loadingPrices ? (
                  <Spinner className="mt-2" />
                ) : currentPrice ? (
                  <p className="text-lg font-semibold text-emerald-600">
                    {Number(currentPrice.price).toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'XAF',
                    })}
                  </p>
                ) : (
                  <p className="text-gray-600 italic">Aucun prix défini</p>
                )} */}
              </div>
            </CardContent>
          </Card>
        {/* </TabsContent>

        <TabsContent value="prices"> */}
          <Card className="mt-4">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Historique des prix</CardTitle>
              <Button size="sm" onClick={() => console.log('open add price modal')}>
                <PlusCircle className="mr-1 h-4 w-4" /> Nouveau prix
              </Button>
            </CardHeader>

            <CardContent>
              {/* {loadingPrices ? (
                <div className="flex items-center justify-center h-40">
                  <Spinner className="mr-2" /> Chargement...
                </div>
              ) : prices.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Prix</TableHead>
                      <TableHead>Date d’entrée en vigueur</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prices.map((price) => (
                      <TableRow key={price.id}>
                        <TableCell>
                          {Number(price.price).toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'XAF',
                          })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(price.effectiveAt), 'dd MMMM yyyy', { locale: fr })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-600 italic">Aucun historique disponible</p>
              )} */}
            </CardContent>
          </Card>
        {/* </TabsContent>
      </Tabs> */}
    </div>
  );
}

export { ProductDetailsPage };
