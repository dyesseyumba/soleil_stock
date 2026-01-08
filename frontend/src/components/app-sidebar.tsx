import * as React from 'react';
import {
  LayoutDashboard,
  PackageSearch,
  Store,
  BadgeDollarSign,
  NotebookPen,
  Settings,
  TruckElectric,
} from 'lucide-react';
import { NavProjects } from '@/components/nav-projects';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import logo from '../assets/logo.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLocation } from 'react-router';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  const data = {
    user: {
      name: 'Bienvenue',
      email: '',
      avatar: '/avatars/shadcn.jpg',
    },
    navSecondary: [
      {
        title: 'Paramètres',
        url: '#',
        icon: Settings,
      },
    ],
    projects: [
      {
        title: 'Tableau de Bord',
        url: '/',
        icon: LayoutDashboard,
        isActive: location.pathname === '/' ? true : false,
      },
      {
        title: 'Vente',
        url: '/sales',
        icon: BadgeDollarSign,
        isActive: location.pathname === '/sales' ? true : false,
      },
      {
        title: 'Commandes',
        url: '/purchases',
        icon: TruckElectric,
        isActive: location.pathname === '/purchases' ? true : false,
      },
      {
        title: 'Fournisseurs',
        url: '/suppliers',
        icon: Store,
        isActive: location.pathname === '/suppliers' ? true : false,
      },
      {
        title: 'Produits',
        url: '/products',
        icon: PackageSearch,
        isActive: location.pathname === '/products' ? true : false,
      },
      {
        title: 'Rapports',
        url: '/reports',
        icon: NotebookPen,
        isActive: location.pathname === '/reports' ? true : false,
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Avatar>
                    <AvatarImage src={logo} />
                    <AvatarFallback>CD</AvatarFallback>
                  </Avatar>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Soleil Shop Air</span>
                  <span className="truncate text-xs">Stock</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
