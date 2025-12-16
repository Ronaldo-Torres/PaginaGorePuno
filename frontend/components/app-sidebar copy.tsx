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
  FaNewspaper as FaNews,
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

// Tipos
interface MenuItem {
  title: string;
  url: string;
  icon: any;
  privilege?: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

// Datos del menú
const data = {
  navMain: [
    {
      title: "PRINCIPAL",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: FaHome },
        { title: "Portadas", url: "/dashboard/portadas", icon: FaImages },
        { title: "Documentos", url: "/dashboard/documentos", icon: FaBook },

      ],
    },
    {
      title: "ADMINISTRAR Gobierno",
      items: [
        { title: "Comisiones de Gobierno", url: "/dashboard/comisiones", icon: FaUsers },
        { title: "Directores y Gerentes", url: "/dashboard/consejeros", icon: FaIdCard },
      ],
    },
    {
      title: "PUBLICACIONES",
      items: [
        { title: "Anuncios", url: "/dashboard/anuncios", icon: FaBullhorn },
        { title: "Noticias", url: "/dashboard/noticias", icon: FaNews },
        { title: "Boletines", url: "/dashboard/boletines", icon: FaFilePdf },
        // { title: "Portadas", url: "/dashboard/portadas", icon: FaImages },
      ],
    },
    {
      title: "REPORTES",
      items: [
        { title: "Atención a la ciudadanía", url: "/dashboard/atenciones", icon: FaHeadset },
      ],
    },
    {
      title: "AGENDAS",
      items: [
        { title: "Agendar reuniones", url: "/dashboard/agendas", icon: FaCalendarAlt },
        { title: "Mis Pendientes", url: "/dashboard/agendas/list", icon: FaClipboardList },
      ],
    },
  ],
  navSecondary: [
    {
      title: "CONFIGURACIÓN",
      items: [
        { title: "Parámetros", url: "/dashboard/parametros", icon: FaCog },
        { title: "Usuarios", url: "/dashboard/users", icon: FaUserCog, privilege: "USER_READ" },
        { title: "Roles", url: "/dashboard/roles", icon: FaShieldAlt, privilege: "ROLE_READ" },
        { title: "Privilegios", url: "/dashboard/privileges", icon: FaShieldAlt, privilege: "PRIVILEGE_READ" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user } = useUser();

  console.log("Usuario actual:", user);
  console.log("Privilegios:", user?.roleDetails?.map((role: any) => role.privileges.map((p: any) => p.name)).flat());

  // Verifica privilegio
  const hasPrivilege = (user: any, privilegeName: string): boolean => {
    const result = user?.roleDetails?.some((role: any) =>
      role.privileges.some((privilege: any) => privilege.name === privilegeName)
    );
    console.log(`Verificando privilegio "${privilegeName}" =>`, result);
    return result;
  };

  // Acceso según privilegio
  const hasAccess = (item: MenuItem) => {
    if (!item.privilege) return true;
    return hasPrivilege(user, item.privilege);
  };

  // Filtra grupos principales según rol
  const filterNavMain = (groups: MenuGroup[], user: any) => {
    // Si el usuario tiene rol IMAGEN, mostrar solo PUBLICACIONES
    if (user?.roleDetails?.some((role: any) => role.name === "IMAGEN")) {
      return groups.filter(group => group.title === "PUBLICACIONES");
    }

    // Para otros usuarios, filtrar según privilegios
    return groups
      .map(group => ({
        ...group,
        items: group.items.filter(item => hasAccess(item)),
      }))
      .filter(group => group.items.length > 0);
  };

  // Filtra navSecondary según privilegios y rol IMAGEN
  const filterNavSecondary = (groups: MenuGroup[], user: any) => {
    // Si el usuario es IMAGEN, no mostrar nada de navSecondary
    if (user?.roleDetails?.some((role: any) => role.name === "IMAGEN")) {
      return [];
    }

    // Para otros usuarios, filtrar según privilegios
    return groups
      .map(group => ({
        ...group,
        items: group.items.filter(item => hasAccess(item)),
      }))
      .filter(group => group.items.length > 0);
  };

  const filteredNavMain = filterNavMain(data.navMain, user);
  // const filteredNavSecondary = filterNavSecondary(data.navSecondary);
  const filteredNavSecondary = filterNavSecondary(data.navSecondary, user);


  const logo = "/logo.png";

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
