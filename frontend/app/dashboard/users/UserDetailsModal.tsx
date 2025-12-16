import { User, Role } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buildAvatarUrl, getInitials } from "@/lib/avatar-utils";
import { Card, CardContent } from "@/components/ui/card";

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  formatDate: (date: string | null) => string;
}

export function UserDetailsModal({
  user,
  isOpen,
  onClose,
  formatDate,
}: UserDetailsModalProps) {
  if (!user) return null;

  const avatarUrl = buildAvatarUrl(user.avatar);
  const initials = getInitials(user.firstName, user.lastName);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-[900px] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Detalles del Usuario</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Avatar and Status */}
            <div className="w-full md:w-1/3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32 sm:h-40 sm:w-40">
                      <AvatarImage
                        src={avatarUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-2xl sm:text-3xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>

                    {/* Estado del usuario */}
                    <div className="w-full pt-6 mt-6 border-t">
                      <div className="flex flex-row items-center justify-between rounded-lg p-4 bg-muted/50">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                user.enabled
                                  ? "bg-green-500 animate-pulse"
                                  : "bg-orange-500"
                              }`}
                            />
                            {user.enabled ? "Activo" : "Inactivo"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.enabled
                              ? "Usuario con acceso al sistema"
                              : "Usuario sin acceso al sistema"}
                          </div>
                        </div>
                        <Badge
                          variant={user.enabled ? "default" : "secondary"}
                          className={
                            user.enabled
                              ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300"
                          }
                        >
                          {user.enabled ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - User Details */}
            <div className="w-full md:w-2/3 space-y-6">
              {/* Información Personal */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">
                    Información Personal
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">Nombre</div>
                      <div className="text-sm">{user.firstName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Apellido</div>
                      <div className="text-sm">{user.lastName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-sm">{user.email}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Teléfono</div>
                      <div className="text-sm">
                        {user.phone || "No especificado"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Roles y Privilegios */}
              {user.roleDetails && user.roleDetails.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">
                      Roles y Privilegios
                    </h4>
                    <div className="space-y-4">
                      {user.roleDetails.map((role) => (
                        <div key={role.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-sm">
                              {role.name}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {role.privileges.map((privilege) => (
                              <Badge
                                key={privilege.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {privilege.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Fechas */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">
                    Información del Sistema
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">
                        Fecha de Registro
                      </div>
                      <div className="text-sm">
                        {formatDate(user.createdAt)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Última Actualización
                      </div>
                      <div className="text-sm">
                        {formatDate(user.updatedAt)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
