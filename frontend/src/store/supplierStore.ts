import { modalStore } from './modalStore';

interface Supplier {
  id: string;
  name: string;
  contactInfo: string;
}

const useSupplierModalStore = modalStore<Supplier>();

export { useSupplierModalStore };
export type { Supplier };
