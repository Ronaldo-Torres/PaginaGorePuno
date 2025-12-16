export interface Documento {
  id?: number;
  numeroDocumento: string;
  nombreDocumento: string;
  descripcion: string;
  fechaEmision: string;
  activo: boolean;
  urlDocumento: string;
  tipoDocumento: {
    id: number;
    nombre: string;
    descripcion?: string;
  } | null;
  anio: {
    id: number;
    anio: string;
  } | null;
  oficina: {
    id: number;
    nombre: string;
    descripcion?: string;
  } | null;
  extension: string;
  tamanio?: string;
  tags: string[];
  consejeros: number[];
  comisiones: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
} 

export interface DocumetoSyncDTO {
  id: number | null;
  tags: string[];
  codigoEmision: string;
  consejeros: number[];
  comisiones: number[];
}