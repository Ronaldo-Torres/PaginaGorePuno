"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ConsejeroService from "@/services/ConsejeroService";
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaTiktok, 
  FaWhatsapp, 
  FaTelegram, 
  FaPinterest, 
  FaSnapchat, 
  FaTwitch, 
  FaLinkedin,
  FaLink,
  FaExternalLinkAlt
} from "react-icons/fa";

interface RedesSociales {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  whatsapp?: string;
  telegram?: string;
  pinterest?: string;
  snapchat?: string;
  kick?: string;
  twitch?: string;
  linkedin?: string;
}

interface FormRedesProps {
  isOpen: boolean;
  onClose: () => void;
  consejeroId?: number;
  redesActuales?: RedesSociales;
  onUpdate?: () => void;
}

export function FormRedes({ isOpen, onClose, consejeroId, redesActuales, onUpdate }: FormRedesProps) {
  const initialFormState: RedesSociales = {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
    whatsapp: "",
    telegram: "",
    pinterest: "",
    snapchat: "",
    kick: "",
    twitch: "",
    linkedin: "",
  };

  const [formData, setFormData] = useState<RedesSociales>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [testingLinks, setTestingLinks] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (redesActuales) {
      setFormData({
        facebook: redesActuales.facebook || "",
        instagram: redesActuales.instagram || "",
        twitter: redesActuales.twitter || "",
        youtube: redesActuales.youtube || "",
        tiktok: redesActuales.tiktok || "",
        whatsapp: redesActuales.whatsapp || "",
        telegram: redesActuales.telegram || "",
        pinterest: redesActuales.pinterest || "",
        snapchat: redesActuales.snapchat || "",
        kick: redesActuales.kick || "",
        twitch: redesActuales.twitch || "",
        linkedin: redesActuales.linkedin || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [redesActuales, isOpen]);

  const handleChange = (field: keyof RedesSociales) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consejeroId) {
      console.error("No se proporcionó ID del consejero");
      return;
    }

    setIsLoading(true);
    try {
      // Crear FormData con solo las redes sociales
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          formDataToSend.append(key, value.trim());
        }
      });

      await ConsejeroService.updateConsejero(consejeroId, formDataToSend);
      
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error("Error al actualizar redes sociales:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setTestingLinks({});
    onClose();
  };

  const testLink = async (url: string | undefined, platform: string) => {
    if (!url || !url.trim()) return;
    
    setTestingLinks(prev => ({ ...prev, [platform]: true }));
    
    try {
      // Verificar si la URL es válida
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      
      // Intentar hacer una petición HEAD para verificar si el enlace existe
      const response = await fetch(urlObj.toString(), { 
        method: 'HEAD',
        mode: 'no-cors' // Para evitar problemas de CORS
      });
      
      // Si llegamos aquí, el enlace es válido
      toast.success(`El enlace de ${platform} es válido`, {
        description: "La URL ingresada es correcta",
        duration: 3000
      });
    } catch (error) {
      // Si hay error, aún puede ser válido (problemas de CORS)
      // Abrir en nueva pestaña para que el usuario verifique manualmente
      const urlToOpen = url.startsWith('http') ? url : `https://${url}`;
      window.open(urlToOpen, '_blank');
      toast.error(`El enlace de ${platform} es inválido`, {
        description: "La URL ingresada no es correcta",
        duration: 3000
      });
    } finally {
      setTestingLinks(prev => ({ ...prev, [platform]: false }));
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <FaFacebook className="h-6 w-6 text-blue-600" />;
      case 'instagram': return <FaInstagram className="h-6 w-6 text-pink-500" />;
      case 'twitter': return <FaTwitter className="h-6 w-6 text-blue-400" />;
      case 'youtube': return <FaYoutube className="h-6 w-6 text-red-600" />;
      case 'tiktok': return <FaTiktok className="h-6 w-6 text-black" />;
      case 'whatsapp': return <FaWhatsapp className="h-6 w-6 text-green-500" />;
      case 'telegram': return <FaTelegram className="h-6 w-6 text-blue-500" />;
      case 'pinterest': return <FaPinterest className="h-6 w-6 text-red-500" />;
      case 'snapchat': return <FaSnapchat className="h-6 w-6 text-yellow-400" />;
      case 'twitch': return <FaTwitch className="h-6 w-6 text-purple-600" />;
      case 'linkedin': return <FaLinkedin className="h-6 w-6 text-blue-700" />;
      case 'kick': return <FaLink className="h-6 w-6 text-gray-600" />; // Icono genérico para Kick
      default: return <FaLink className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Redes Sociales</DialogTitle>
          <DialogDescription>
            Actualiza las redes sociales del consejero. Deja vacío el campo si no deseas mostrar esa red social.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center w-12 h-10 bg-gray-50  rounded-md">
                  {getSocialIcon('facebook')}
                </div>
                <Input
                  id="facebook"
                  placeholder="URL de Facebook"
                  value={formData.facebook}
                  onChange={handleChange("facebook")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => testLink(formData.facebook, 'Facebook')}
                  disabled={!formData.facebook || testingLinks.facebook}
                  title="Probar enlace"
                >
                  {testingLinks.facebook ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                  ) : (
                    <FaExternalLinkAlt className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center w-12 h-10 bg-gray-50  rounded-md">
                  {getSocialIcon('instagram')}
                </div>
                <Input
                  id="instagram"
                  placeholder="URL de Instagram"
                  value={formData.instagram}
                  onChange={handleChange("instagram")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => testLink(formData.instagram, 'Instagram')}
                  disabled={!formData.instagram || testingLinks.instagram}
                  title="Probar enlace"
                >
                  {testingLinks.instagram ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                  ) : (
                    <FaExternalLinkAlt className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center w-12 h-10 bg-gray-50  rounded-md">
                  {getSocialIcon('twitter')}
                </div>
                <Input
                  id="twitter"
                  placeholder="URL de Twitter"
                  value={formData.twitter}
                  onChange={handleChange("twitter")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => testLink(formData.twitter, 'Twitter')}
                  disabled={!formData.twitter || testingLinks.twitter}
                  title="Probar enlace"
                >
                  {testingLinks.twitter ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                  ) : (
                    <FaExternalLinkAlt className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center w-12 h-10 bg-gray-50  rounded-md">
                  {getSocialIcon('youtube')}
                </div>
                <Input
                  id="youtube"
                  placeholder="URL de YouTube"
                  value={formData.youtube}
                  onChange={handleChange("youtube")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => testLink(formData.youtube, 'YouTube')}
                  disabled={!formData.youtube || testingLinks.youtube}
                  title="Probar enlace"
                >
                  {testingLinks.youtube ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                  ) : (
                    <FaExternalLinkAlt className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center w-12 h-10 bg-gray-50  rounded-md">
                  {getSocialIcon('tiktok')}
                </div>
                <Input
                  id="tiktok"
                  placeholder="URL de TikTok"
                  value={formData.tiktok}
                  onChange={handleChange("tiktok")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => testLink(formData.tiktok, 'TikTok')}
                  disabled={!formData.tiktok || testingLinks.tiktok}
                  title="Probar enlace"
                >
                  {testingLinks.tiktok ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                  ) : (
                    <FaExternalLinkAlt className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center w-12 h-10 bg-gray-50  rounded-md">
                  {getSocialIcon('whatsapp')}
                </div>
                <Input
                  id="whatsapp"
                  placeholder="Número de WhatsApp"
                  value={formData.whatsapp}
                  onChange={handleChange("whatsapp")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => testLink(formData.whatsapp, 'WhatsApp')}
                  disabled={!formData.whatsapp || testingLinks.whatsapp}
                  title="Probar enlace"
                >
                  {testingLinks.whatsapp ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                  ) : (
                    <FaExternalLinkAlt className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telegram">Telegram</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center w-12 h-10 bg-gray-50  rounded-md">
                  {getSocialIcon('telegram')}
                </div>
                <Input
                  id="telegram"
                  placeholder="URL de Telegram"
                  value={formData.telegram}
                  onChange={handleChange("telegram")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => testLink(formData.telegram, 'Telegram')}
                  disabled={!formData.telegram || testingLinks.telegram}
                  title="Probar enlace"
                >
                  {testingLinks.telegram ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                  ) : (
                    <FaExternalLinkAlt className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pinterest">Pinterest</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center w-12 h-10 bg-gray-50  rounded-md">
                  {getSocialIcon('pinterest')}
                </div>
                <Input
                  id="pinterest"
                  placeholder="URL de Pinterest"
                  value={formData.pinterest}
                  onChange={handleChange("pinterest")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => testLink(formData.pinterest, 'Pinterest')}
                  disabled={!formData.pinterest || testingLinks.pinterest}
                  title="Probar enlace"
                >
                  {testingLinks.pinterest ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                  ) : (
                    <FaExternalLinkAlt className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="snapchat">Snapchat</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center w-12 h-10 bg-gray-50  rounded-md">
                  {getSocialIcon('snapchat')}
                </div>
                <Input
                  id="snapchat"
                  placeholder="URL de Snapchat"
                  value={formData.snapchat}
                  onChange={handleChange("snapchat")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => testLink(formData.snapchat, 'Snapchat')}
                  disabled={!formData.snapchat || testingLinks.snapchat}
                  title="Probar enlace"
                >
                  {testingLinks.snapchat ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                  ) : (
                    <FaExternalLinkAlt className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kick">Kick</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center w-12 h-10 bg-gray-50  rounded-md">
                  {getSocialIcon('kick')}
                </div>
                <Input
                  id="kick"
                  placeholder="URL de Kick"
                  value={formData.kick}
                  onChange={handleChange("kick")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => testLink(formData.kick, 'Kick')}
                  disabled={!formData.kick || testingLinks.kick}
                  title="Probar enlace"
                >
                  {testingLinks.kick ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                  ) : (
                    <FaExternalLinkAlt className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitch">Twitch</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center w-12 h-10 bg-gray-50  rounded-md">
                  {getSocialIcon('twitch')}
                </div>
                <Input
                  id="twitch"
                  placeholder="URL de Twitch"
                  value={formData.twitch}
                  onChange={handleChange("twitch")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => testLink(formData.twitch, 'Twitch')}
                  disabled={!formData.twitch || testingLinks.twitch}
                  title="Probar enlace"
                >
                  {testingLinks.twitch ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                  ) : (
                    <FaExternalLinkAlt className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center w-12 h-10 bg-gray-50  rounded-md">
                  {getSocialIcon('linkedin')}
                </div>
                <Input
                  id="linkedin"
                  placeholder="URL de LinkedIn"
                  value={formData.linkedin}
                  onChange={handleChange("linkedin")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => testLink(formData.linkedin, 'LinkedIn')}
                  disabled={!formData.linkedin || testingLinks.linkedin}
                  title="Probar enlace"
                >
                  {testingLinks.linkedin ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                  ) : (
                    <FaExternalLinkAlt className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FormRedes;
