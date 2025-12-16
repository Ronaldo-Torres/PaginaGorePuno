"use client";

import { useEffect, useState } from "react";
import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import AuthService from "@/lib/auth-service";
import { useUser } from "@/lib/store";
import { buildAvatarUrl } from "@/lib/avatar-utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// Datos de usuario por defecto para fallback
const defaultUserData = {
  name: "Usuario",
  email: "usuario@ejemplo.com",
  avatar: "/avatars/default.jpg",
};

export function NavUser({
  user: propsUser,
}: {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { user: storeUser } = useUser();

  // Estado local para mostrar datos de usuario
  const [userData, setUserData] = useState(propsUser || defaultUserData);

  // Actualizar datos cuando cambie el usuario del store
  useEffect(() => {
    if (storeUser) {
      const avatarUrl = buildAvatarUrl(
        storeUser.avatar,
        "/avatars/default.jpg"
      );

      setUserData({
        name: `${storeUser.firstName} ${storeUser.lastName}`,
        email: storeUser.email,
        avatar: avatarUrl || "/avatars/default.jpg",
      });
    } else if (propsUser) {
      setUserData(propsUser);
    }
  }, [storeUser, propsUser]);

  const handleLogout = () => {
    AuthService.logout();
  };

  const handleNavigateToProfile = () => {
    router.push("/dashboard/profile");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage
                  src={userData.avatar || buildAvatarUrl(userData.avatar)}
                  alt={userData.name}
                />
                <AvatarFallback className="rounded-lg">
                  {userData.name.charAt(0)}
                  {userData.name.charAt(1)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {userData.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userData.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleNavigateToProfile}>
                <IconUserCircle />
                Perfil de usuario
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
