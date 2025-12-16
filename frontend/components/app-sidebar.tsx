"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  FaHome,
  FaUsers,
  FaCog,
  FaShieldAlt,
  FaBook,
  FaNewspaper,
  FaCalendarAlt,
  FaFileAlt,
  FaUserCog,
  FaIdCard,
  FaBullhorn,
  FaFilePdf,
  FaImages,
  FaHeadset,
  FaClipboardList,
} from "react-icons/fa";
import { useUser } from "@/lib/store";
import { NavUser } from "@/components/nav-user";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

// ----------------------------
// Tipos
// ----------------------------
interface MenuItem {
  title: string;
  url: string;
  icon: any;
  privilege?: string;
  roles?: string[]; // ← nuevos roles permitidos
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

// ----------------------------
// Datos del menú
// ----------------------------
const data = {
  navMain: [
    {
      title: "PRINCIPAL",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: FaHome, roles: ["ADMIN"] },
        { title: "Portadas", url: "/dashboard/portadas", icon: FaImages, roles: ["ADMIN"] },
        { title: "Documentos", url: "/dashboard/documentos", icon: FaBook, roles: ["ADMIN"] },
      ],
    },
    {
      title: "ADMINISTRAR Gobierno",
      items: [
        { title: "Comisiones de Gobierno", url: "/dashboard/comisiones", icon: FaUsers, roles: ["ADMIN"] },
        { title: "Directores y Gerentes", url: "/dashboard/consejeros", icon: FaIdCard, roles: ["ADMIN"] },
      ],
    },
    {
      title: "PUBLICACIONES",
      items: [
        { title: "Anuncios", url: "/dashboard/anuncios", icon: FaBullhorn, roles: ["IMAGEN", "ADMIN"] },
        { title: "Noticias", url: "/dashboard/noticias", icon: FaNewspaper, roles: ["IMAGEN", "ADMIN"] },
        { title: "Boletines", url: "/dashboard/boletines", icon: FaFilePdf, roles: ["IMAGEN", "ADMIN"] },
      ],
    },
    {
      title: "REPORTES",
      items: [
        { title: "Atención a la ciudadanía", url: "/dashboard/atenciones", icon: FaHeadset, roles: ["ADMIN"] },
      ],
    },
    {
      title: "AGENDAS",
      items: [
        { title: "Agendar reuniones", url: "/dashboard/agendas", icon: FaCalendarAlt, roles: ["ADMIN"] },
        { title: "Mis Pendientes", url: "/dashboard/agendas/list", icon: FaClipboardList, roles: ["ADMIN"] },
      ],
    },
  ],
  navSecondary: [
    {
      title: "CONFIGURACIÓN",
      items: [
        { title: "Parámetros", url: "/dashboard/parametros", icon: FaCog, roles: ["ADMIN"] },
        { title: "Usuarios", url: "/dashboard/users", icon: FaUserCog, privilege: "USER_READ", roles: ["ADMIN"] },
        { title: "Roles", url: "/dashboard/roles", icon: FaShieldAlt, privilege: "ROLE_READ", roles: ["ADMIN"] },
        { title: "Privilegios", url: "/dashboard/privileges", icon: FaShieldAlt, privilege: "PRIVILEGE_READ", roles: ["ADMIN"] },
      ],
    }
  ],
};

// ----------------------------
// Componente principal
// ----------------------------
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user } = useUser();

  console.log("Usuario actual:", user);

  // ----------------------------
  // Funciones de verificación
  // ----------------------------
  const hasRole = (user: any, allowedRoles?: string[]): boolean => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return user?.roleDetails?.some((role: any) => allowedRoles.includes(role.name));
  };

  const hasPrivilege = (user: any, privilegeName?: string): boolean => {
    if (!privilegeName) return true;
    return user?.roleDetails?.some((role: any) =>
      role.privileges.some((privilege: any) => privilege.name === privilegeName)
    );
  };

  const hasAccess = (user: any, item: MenuItem): boolean => {
    return hasRole(user, item.roles) && hasPrivilege(user, item.privilege);
  };

  const filterNav = (groups: MenuGroup[], user: any) => {
    return groups
      .map(group => ({
        ...group,
        items: group.items.filter(item => hasAccess(user, item)),
      }))
      .filter(group => group.items.length > 0);
  };

  const filteredNavMain = filterNav(data.navMain, user);
  const filteredNavSecondary = filterNav(data.navSecondary, user);

  const logo = "/logo.png";

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 px-4 flex items-center justify-center">
        <SidebarMenu className="w-full">
          <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-0">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image src={logo} alt="GORE PUNO" width={32} height={32} className="!size-8" />
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-medium text-white leading-none">GORE PUNO</span>
                  <div className="text-[10px] text-white/80 leading-tight">
                    Gobierno Regional de Puno
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <Separator className="bg-sidebar-accent" />

      <SidebarContent className="gap-0">
        {filteredNavMain.map(group => (
          <Collapsible key={group.title} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {group.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map(item => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={pathname === item.url}>
                          <Link href={item.url} className="flex items-center gap-3">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}

        {filteredNavSecondary.map(group => (
          <Collapsible key={group.title} defaultOpen className="group/collapsible mt-auto">
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {group.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map(item => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={pathname === item.url}>
                          <Link href={item.url} className="flex items-center gap-3">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
