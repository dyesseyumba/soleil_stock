import { type LucideIcon } from 'lucide-react';

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export function NavProjects({
  projects,
}: {
  projects: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive: boolean;
  }[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className={item.isActive ? 'bg-gray-100 font-bold' : ''}>
              <a href={item.url} >
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
