import * as React from 'react';
import { LayoutDashboard, PackageSearch, Store, BadgeDollarSign, NotebookPen, Settings } from 'lucide-react';
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

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
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
      url: '#',
      icon: LayoutDashboard,
    },
    {
      title: 'Produits',
      url: '#',
      icon: PackageSearch,
    },
    {
      title: 'Fournisseurs',
      url: '#',
      icon: Store,
    },
    {
      title: 'Achats et Vente',
      url: '#',
      icon: BadgeDollarSign,
    },
    {
      title: 'Rapports',
      url: '#',
      icon: NotebookPen,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Avatar>
                    <AvatarImage src={logo} />
                    <AvatarFallback>CN</AvatarFallback>
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
