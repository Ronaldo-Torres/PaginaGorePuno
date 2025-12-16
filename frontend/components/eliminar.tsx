import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EliminarProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dataTitle: string;
}

export function Eliminar({
  isOpen,
  onClose,
  onConfirm,
  dataTitle,
}: EliminarProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Confirmar eliminacion
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Estas seguro que deseas eliminar el registro "{dataTitle}"? Esta accion
          no se puede revertir.
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="dark:bg-secondary"
          >
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
