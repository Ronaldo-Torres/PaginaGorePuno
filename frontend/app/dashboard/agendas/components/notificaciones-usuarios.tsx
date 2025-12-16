import { useState } from "react";
import { Bell, Info, CheckCircle, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id?: string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  roles?: string[] | null;
  enabled: boolean;
  createdAt: string | null;
  avatar?: string;
}

interface NotificacionesUsuariosProps {
  usuarios: User[];
  isLoadingUsers: boolean;
  isLoadingNotificaciones: boolean;
  notificacionesPrevias: any[];
  usuariosSeleccionados: string[];
  setUsuariosSeleccionados: (usuarios: string[]) => void;
  enviarCorreo: boolean;
  setEnviarCorreo: (enviar: boolean) => void;
  onReenviarNotificacion: (notificacionId: number) => void;
  isLoadingReenvio: boolean;
  notificacionToReenviar: number | null;
}

export default function NotificacionesUsuarios({
  usuarios,
  isLoadingUsers,
  isLoadingNotificaciones,
  notificacionesPrevias,
  usuariosSeleccionados,
  setUsuariosSeleccionados,
  enviarCorreo,
  setEnviarCorreo,
  onReenviarNotificacion,
  isLoadingReenvio,
  notificacionToReenviar,
}: NotificacionesUsuariosProps) {
  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-start gap-2 flex-col">
          <div className="flex items-start gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Notificaciones</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              (Se enviará un correo a los usuarios seleccionados)
            </span>
          </div>
        </div>
        <Switch checked={enviarCorreo} onCheckedChange={setEnviarCorreo} />
      </div>

      {enviarCorreo && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Selecciona los usuarios a notificar
          </Label>
          {isLoadingNotificaciones ? (
            <div className="text-sm text-muted-foreground italic">
              Cargando notificaciones previas...
            </div>
          ) : notificacionesPrevias.length > 0 ? (
            <div className="mb-4 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium mb-2">
                Notificaciones enviadas previamente:
              </p>
              <div className="space-y-2">
                {notificacionesPrevias.map((notif: any) => {
                  const usuario = usuarios.find(
                    (u) => u.uuid === notif.userId[0]
                  );
                  return usuario ? (
                    <div
                      key={`notif-${notif.id}-${usuario.uuid}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor:
                              notif.estado === "asistire"
                                ? "#00e868"
                                : notif.estado === "no_asistire"
                                ? "#ff4242"
                                : "#ffd21e",
                          }}
                        />
                        <span>
                          {usuario.firstName} {usuario.lastName}
                        </span>
                        <span className="text-muted-foreground">
                          ({usuario.email})
                        </span>
                      </div>
                      {(!notif.estado ||
                        notif.estado === "pendiente" ||
                        notif.estado === "reenviado") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-blue-500 hover:text-blue-700"
                          onClick={() => onReenviarNotificacion(notif.id)}
                          disabled={
                            isLoadingReenvio &&
                            notificacionToReenviar === notif.id
                          }
                        >
                          {isLoadingReenvio &&
                          notificacionToReenviar === notif.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Reenviar correo
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ) : null}
          <div className="border rounded-md p-4 space-y-2">
            {isLoadingUsers ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              usuarios.map((usuario) => {
                const notificacionPrevia = notificacionesPrevias.find((n) =>
                  n.userId.includes(usuario.uuid)
                );
                const yaNotificado = !!notificacionPrevia;

                return (
                  <div
                    key={`usuario-${usuario.uuid}`}
                    className="flex items-center space-x-3"
                  >
                    {yaNotificado ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Checkbox
                        id={`checkbox-${usuario.uuid}`}
                        checked={usuariosSeleccionados.includes(usuario.uuid)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            // Agregar solo el UUID a la lista de seleccionados
                            setUsuariosSeleccionados([
                              ...usuariosSeleccionados,
                              usuario.uuid,
                            ]);
                          } else {
                            // Remover solo este UUID de la lista
                            setUsuariosSeleccionados(
                              usuariosSeleccionados.filter(
                                (uuid) => uuid !== usuario.uuid
                              )
                            );
                          }
                        }}
                      />
                    )}
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={usuario.avatar}
                        alt={`${usuario.firstName} ${usuario.lastName}`}
                      />
                      <AvatarFallback>
                        {`${usuario.firstName[0]}${usuario.lastName[0]}`}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{`${usuario.firstName} ${usuario.lastName}`}</span>
                        {yaNotificado && (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  notificacionPrevia.estado === "asistire"
                                    ? "#00e868"
                                    : notificacionPrevia.estado ===
                                      "no_asistire"
                                    ? "#ff4242"
                                    : "#ffd21e",
                              }}
                            />
                            <Badge variant="outline" className="text-xs">
                              {notificacionPrevia.estado === "asistire"
                                ? "Asistirá"
                                : notificacionPrevia.estado === "no_asistire"
                                ? "No Asistirá"
                                : "Pendiente"}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {usuario.email}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {usuario.roles?.[0] === "ADMIN"
                          ? "Administrador"
                          : "Usuario"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
