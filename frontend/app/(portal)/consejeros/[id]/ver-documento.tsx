import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ViewerWrapper from "@/components/view-pdf";

export function VerDocumento({
  open,
  onOpenChange,
  documento,
  consejero,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documento: string;
  consejero: any;
}) {
  const fileUrl = `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${documento}`;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" mb-8 flex h-[calc(80vh-2rem)] min-w-[calc(60vw-2rem)] flex-col justify-between gap-0">
        <DialogHeader>
          <DialogTitle className="text-center font-sans ">
            Credencial JNE - {consejero?.nombre} {consejero?.apellido}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ViewerWrapper fileUrl={fileUrl || ""} />
      </DialogContent>
    </Dialog>
  );
}
