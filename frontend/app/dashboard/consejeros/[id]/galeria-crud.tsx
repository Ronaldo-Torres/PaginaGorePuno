"use client";

import { useState, useEffect, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaImages, 
  FaDownload, 
  FaUpload,
  FaEye,
  FaSearch,
  FaSpinner,
  FaFileImage,
  FaChevronLeft,
  FaChevronRight,
  FaTimes
} from "react-icons/fa";
import Image from "next/image";
import GaleriaService, { ConsejeroGaleria } from "@/services/GaleriaService";
import { toast } from "react-hot-toast";

interface GaleriaCrudProps {
  consejeroId: string;
}

interface FormData {
  descripcion: string;
  nombre: string;
  file?: File;
}

const GaleriaCrud = ({ consejeroId }: GaleriaCrudProps) => {
  // Estados principales
  const [fotos, setFotos] = useState<ConsejeroGaleria[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Estados para modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMassUploadModalOpen, setIsMassUploadModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Estados para formularios
  const [formData, setFormData] = useState<FormData>({
    descripcion: "",
    nombre: "",
    file: undefined,
  });
  const [editingFoto, setEditingFoto] = useState<ConsejeroGaleria | null>(null);
  const [deletingFoto, setDeletingFoto] = useState<ConsejeroGaleria | null>(null);
  const [previewFoto, setPreviewFoto] = useState<ConsejeroGaleria | null>(null);

  // Estados para carga masiva
  const [massUploadFiles, setMassUploadFiles] = useState<File[]>([]);
  const [massUploadProgress, setMassUploadProgress] = useState(0);
  const [isMassUploading, setIsMassUploading] = useState(false);

  // Referencias
  const fileInputRef = useRef<HTMLInputElement>(null);
  const massUploadInputRef = useRef<HTMLInputElement>(null);

  // Búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar fotos
  const loadFotos = async (page = 0) => {
    setLoading(true);
    try {
      const response = await GaleriaService.getGaleriaConsejeros(
        consejeroId,
        page,
        pageSize
      );
      
      setFotos(response.content || []);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error al cargar fotos:", error);
      toast.error("Error al cargar las fotos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFotos();
  }, [consejeroId]);

  // Manejar creación
  const handleCreate = async () => {
    if (!formData.file || !formData.descripcion.trim()) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      await GaleriaService.createGaleriaConsejero(
        consejeroId,
        formData.file,
        formData.descripcion,
        parseInt(consejeroId),
        formData.nombre || undefined
      );
      
      toast.success("Foto agregada exitosamente");
      setIsCreateModalOpen(false);
      resetForm();
      loadFotos(currentPage);
    } catch (error) {
      console.error("Error al crear foto:", error);
      toast.error("Error al agregar la foto");
    }
  };

  // Manejar edición
  const handleEdit = async () => {
    if (!editingFoto || !formData.descripcion.trim()) {
      toast.error("Por favor completa la descripción");
      return;
    }

    try {
      await GaleriaService.updateGaleriaConsejero(
        editingFoto.id,
        formData.file || undefined,
        formData.descripcion,
        parseInt(consejeroId),
        formData.nombre || undefined
      );
      
      toast.success("Foto actualizada exitosamente");
      setIsEditModalOpen(false);
      setEditingFoto(null);
      resetForm();
      loadFotos(currentPage);
    } catch (error) {
      console.error("Error al actualizar foto:", error);
      toast.error("Error al actualizar la foto");
    }
  };

  // Manejar eliminación
  const handleDelete = async () => {
    if (!deletingFoto) return;

    try {
      await GaleriaService.deleteGaleriaConsejero(deletingFoto.id);
      toast.success("Foto eliminada exitosamente");
      setIsDeleteDialogOpen(false);
      setDeletingFoto(null);
      loadFotos(currentPage);
    } catch (error) {
      console.error("Error al eliminar foto:", error);
      toast.error("Error al eliminar la foto");
    }
  };

  // Manejar carga masiva
  const handleMassUpload = async () => {
    if (massUploadFiles.length === 0) {
      toast.error("Por favor selecciona al menos una imagen");
      return;
    }

    setIsMassUploading(true);
    setMassUploadProgress(0);

    try {
      const total = massUploadFiles.length;
      let completed = 0;

      for (const file of massUploadFiles) {
        await GaleriaService.createGaleriaConsejero(
          consejeroId,
          file,
          `Imagen subida masivamente: ${file.name}`,
          parseInt(consejeroId),
          file.name.replace(/\.[^/.]+$/, "") // Nombre sin extensión
        );
        
        completed++;
        setMassUploadProgress((completed / total) * 100);
      }

      toast.success(`${total} fotos subidas exitosamente`);
      setIsMassUploadModalOpen(false);
      setMassUploadFiles([]);
      loadFotos(0); // Volver a la primera página
    } catch (error) {
      console.error("Error en carga masiva:", error);
      toast.error("Error durante la carga masiva");
    } finally {
      setIsMassUploading(false);
      setMassUploadProgress(0);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      descripcion: "",
      nombre: "",
      file: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Abrir modal de edición
  const openEditModal = (foto: ConsejeroGaleria) => {
    setEditingFoto(foto);
    setFormData({
      descripcion: foto.descripcion || "",
      nombre: foto.nombre || "",
      file: undefined,
    });
    setIsEditModalOpen(true);
  };

  // Abrir modal de eliminación
  const openDeleteDialog = (foto: ConsejeroGaleria) => {
    setDeletingFoto(foto);
    setIsDeleteDialogOpen(true);
  };

  // Abrir preview
  const openPreview = (foto: ConsejeroGaleria) => {
    setPreviewFoto(foto);
    setIsPreviewModalOpen(true);
  };

  // Filtrar fotos por búsqueda
  const filteredFotos = fotos.filter(foto =>
    foto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    foto.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
            {/* Header con acciones - Diseño profesional */}
      <Card className="rounded-xl border dark:border-border dark:bg-background bg-muted/50">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="space-y-2">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Galería Fotográfica
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-muted-foreground">
            {searchTerm ? (
              `Mostrando ${filteredFotos.length} de ${totalElements} fotografías (filtradas)`
            ) : (
              `Total: ${totalElements} fotografías`
            )}
          </CardDescription>
        </div>
                    <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-xl"
          >
            <FaPlus className="h-4 w-4" />
            Agregar
          </Button>
          <Button 
            onClick={() => setIsMassUploadModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2 rounded-xl"
          >
            <FaUpload className="h-4 w-4" />
            Carga Múltiple
          </Button>
        </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Barra de búsqueda profesional */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                placeholder="Buscar fotografías por descripción o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-3 rounded-xl dark:bg-secondary bg-white"
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="h-6 w-6 p-0 rounded-full"
                  >
                    <FaTimes className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Grid de Cards de fotos */}
          {loading ? (
            <div className="text-center py-24">
              <div className="rounded-xl border dark:border-border dark:bg-background bg-muted/50 p-12 max-w-md mx-auto">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <FaSpinner className="h-8 w-8 animate-spin text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Cargando galería</h3>
                <p className="text-muted-foreground">Obteniendo las fotografías del consejero...</p>
              </div>
            </div>
          ) : filteredFotos.length === 0 ? (
            <div className="text-center py-24">
              <div className="rounded-xl border dark:border-border dark:bg-background bg-muted/50 p-12 max-w-lg mx-auto">
                <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <FaImages className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Galería vacía</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
                  Aún no hay fotografías en esta galería. Comienza agregando la primera imagen del consejero.
                </p>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl"
                >
                  <FaPlus className="h-4 w-4" />
                  Agregar primera foto
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredFotos.map((foto) => (
                <Card key={foto.id} className="group overflow-hidden rounded-xl border dark:border-border dark:bg-background bg-muted/50 transition-all duration-500 hover:shadow-lg">
                  <div className="relative aspect-square bg-gray-100 dark:bg-zinc-800">
                    {/* Imagen principal */}
                    <div 
                      className="w-full h-full relative cursor-pointer overflow-hidden rounded-t-xl"
                      onClick={() => openPreview(foto)}
                    >
                      {foto.urlImagen ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${foto.urlImagen}`}
                          alt={foto.descripcion || "Fotografía"}
                          fill
                          className="object-cover group-hover:scale-110 transition-all duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                          <FaFileImage className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Overlay con acciones - Más elegante */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4">
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPreview(foto);
                          }}
                          className="bg-white/95 hover:bg-white text-gray-700 border-0 shadow-lg backdrop-blur-sm h-9 w-9 p-0 rounded-full"
                          title="Ver imagen"
                        >
                          <FaEye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(foto);
                          }}
                          className="bg-blue-600/95 hover:bg-blue-700 text-white border-0 shadow-lg backdrop-blur-sm h-9 w-9 p-0 rounded-full"
                          title="Editar imagen"
                        >
                          <FaEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteDialog(foto);
                          }}
                          className="bg-red-600/95 hover:bg-red-700 border-0 shadow-lg backdrop-blur-sm h-9 w-9 p-0 rounded-full"
                          title="Eliminar imagen"
                        >
                          <FaTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Indicador de hover sutil */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="rounded-xl dark:bg-secondary bg-white p-2 shadow-lg backdrop-blur-sm">
                        <FaEye className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Contenido del card - Rediseñado */}
                  <CardContent className="p-5 dark:bg-muted/50 bg-white">
                    <div className="space-y-3">
                      {/* Nombre como título principal si existe */}
                      {foto.nombre && (
                        <div className="mb-2">
                          <h3 
                            className="text-sm font-semibold leading-tight"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                            title={foto.nombre}
                          >
                            {foto.nombre}
                          </h3>
                        </div>
                      )}
                      
                      {/* Descripción */}
                      <div className="min-h-[2.5rem] flex items-start">
                        <p 
                          className="text-xs text-muted-foreground leading-relaxed"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: foto.nombre ? 2 : 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                          title={foto.descripcion}
                        >
                          {foto.descripcion}
                        </p>
                      </div>
                      
                      {/* Footer con fecha */}
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            <span className="text-xs font-medium text-blue-600">
                              Imagen
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">
                            {foto.fechaCreacion && 
                              new Date(foto.fechaCreacion).toLocaleDateString('es-PE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                              })
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Paginación profesional */}
          {totalPages > 1 && (
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Información de páginas */}
                <div className="text-sm text-muted-foreground font-medium">
                  Mostrando {filteredFotos.length} de {totalElements} fotografías
                </div>
                
                {/* Controles de navegación */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadFotos(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="rounded-xl dark:bg-secondary bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft className="h-3 w-3 mr-1" />
                    Anterior
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Página</span>
                    <div className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full min-w-[2.5rem] text-center">
                      {currentPage + 1}
                    </div>
                    <span className="text-sm text-muted-foreground">de {totalPages}</span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadFotos(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="rounded-xl dark:bg-secondary bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                    <FaChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Crear Foto */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Nueva Foto</DialogTitle>
            <DialogDescription>
              Sube una nueva foto a la galería del consejero
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="create-file">Imagen *</Label>
              <Input
                id="create-file"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setFormData(prev => ({ ...prev, file }));
                }}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="create-descripcion">Descripción *</Label>
              <Textarea
                id="create-descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  descripcion: e.target.value 
                }))}
                placeholder="Describe la imagen..."
                required
              />
            </div>

            <div>
              <Label htmlFor="create-nombre">Nombre (opcional)</Label>
              <Input
                id="create-nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  nombre: e.target.value 
                }))}
                placeholder="Nombre de la imagen..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate}>
              <FaPlus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Foto */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Foto</DialogTitle>
            <DialogDescription>
              Modifica los datos de la foto
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-file">Imagen (opcional - deja vacío para mantener actual)</Label>
              <Input
                id="edit-file"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setFormData(prev => ({ ...prev, file }));
                }}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-descripcion">Descripción *</Label>
              <Textarea
                id="edit-descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  descripcion: e.target.value 
                }))}
                placeholder="Describe la imagen..."
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-nombre">Nombre (opcional)</Label>
              <Input
                id="edit-nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  nombre: e.target.value 
                }))}
                placeholder="Nombre de la imagen..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>
              <FaEdit className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Carga Masiva */}
      <Dialog open={isMassUploadModalOpen} onOpenChange={setIsMassUploadModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Carga Masiva de Fotos</DialogTitle>
            <DialogDescription>
              Selecciona múltiples imágenes para subir de una vez
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="mass-upload">Seleccionar Imágenes</Label>
              <Input
                id="mass-upload"
                type="file"
                accept="image/*"
                multiple
                ref={massUploadInputRef}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setMassUploadFiles(files);
                }}
              />
              {massUploadFiles.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {massUploadFiles.length} archivo(s) seleccionado(s)
                </p>
              )}
            </div>

            {isMassUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso:</span>
                  <span>{Math.round(massUploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${massUploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsMassUploadModalOpen(false)}
              disabled={isMassUploading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleMassUpload}
              disabled={massUploadFiles.length === 0 || isMassUploading}
            >
              {isMassUploading ? (
                <>
                  <FaSpinner className="h-4 w-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <FaUpload className="h-4 w-4 mr-2" />
                  Subir {massUploadFiles.length} foto(s)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Preview */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vista Previa</DialogTitle>
          </DialogHeader>
          
          {previewFoto && (
            <div className="space-y-4">
              <div className="relative w-full h-96">
                {previewFoto.urlImagen ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${previewFoto.urlImagen}`}
                    alt={previewFoto.descripcion || "Vista previa"}
                    fill
                    className="object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <FaFileImage className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Descripción:</h3>
                <p className="text-gray-700">{previewFoto.descripcion}</p>
                
                {previewFoto.nombre && (
                  <>
                    <h3 className="font-semibold">Nombre:</h3>
                    <p className="text-gray-700">{previewFoto.nombre}</p>
                  </>
                )}
                
                {previewFoto.fechaCreacion && (
                  <>
                    <h3 className="font-semibold">Fecha de creación:</h3>
                    <p className="text-gray-700">
                      {new Date(previewFoto.fechaCreacion).toLocaleString('es-PE')}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirmación Eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La foto será eliminada permanentemente de la galería.
              {deletingFoto && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <strong>Foto:</strong> {deletingFoto.descripcion}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GaleriaCrud; 