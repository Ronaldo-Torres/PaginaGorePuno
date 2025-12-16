//api principal
import axios from 'axios';
import { Atencion } from './AtencionService';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL_SGD = process.env.NEXT_PUBLIC_API_BASE_URL_SGD_SERVICIO;

const getAllPrincipal = async () => {
    const response = await axios.get(`${API_URL}/public/principal`);
    return response;
};

const getAllLinkInteres = async () => {
    const response = await axios.get(`${API_URL}/public/principal/link-interes`);
    return response;
};

const getAllServicios = async () => {
    const response = await axios.get(`${API_URL}/public/principal/servicios`);
    return response;
};

const getParametro = async (id: number) => {
    const response = await axios.get(`${API_URL}/public/principal/parametros/${id}`);
    return response;
};

const getAnuncio = async (estado: boolean) => {
    const response = await axios.get(`${API_URL}/public/principal/anuncios/${estado}`);
    return response;
};

const getAllConsejeros = async () => {
    const response = await axios.get(`${API_URL}/public/principal/consejeros`);
    return response;
}

const getConsejero = async (id: number) => {
    const response = await axios.get(`${API_URL}/public/principal/consejero/${id}`);
    return response;
}

const getAllComisiones = async () => {
    const response = await axios.get(`${API_URL}/public/principal/comisiones`);
    return response;
}

const getConsejeroComision = async (id: number) => {
    const response = await axios.get(`${API_URL}/public/principal/consejero_comision/${id}`);
    return response;
}

const getActividades = async (id: number) => {
    const response = await axios.get(`${API_URL}/public/principal/actividades/${id}`);
    return response;
}

const getImagenesActividad = async (id: number) => {
    const response = await axios.get(`${API_URL}/public/principal/actividad/${id}/imagenes`);
    return response;
}

const getDocumentos = async (id: number) => {
    const response = await axios.get(`${API_URL}/public/principal/documentos/${id}`);
    return response;
}

const getTiposDocumentos = async (grupo: string) => {
    const response = await axios.get(`${API_URL}/public/principal/documentos/tipo?grupo=${grupo}`);
    return response;
}

const getNoticias = async () => {
    const response = await axios.get(`${API_URL}/public/principal/noticias`);
    return response.data;
}

const getNoticiaDestacada = async () => {
    const response = await axios.get(`${API_URL}/public/principal/noticia/destacada`);
    return response.data;
}

const getNoticiaUltimas = async () => {
    const response = await axios.get(`${API_URL}/public/principal/noticia/ultimas`);
    return response.data;
}

const getBoletines = async () => {
    const response = await axios.get(`${API_URL}/public/principal/boletin`);
    return response;
}

const getNoticiasBreves = async () => {
    const response = await axios.get(`${API_URL}/public/principal/noticia/breves`);
    return response.data;
}


const getNoticiaImagenes = async (id: number) => {
    const response = await axios.get(`${API_URL}/public/principal/noticia/imagenes/${id}`);
    return response.data;
}

const getNoticiaUltimasPrincipales = async () => {
    const response = await axios.get(`${API_URL}/public/principal/noticias/principales`);
    return response.data;
}

const getNoticiasImportantesAnteriores = async () => {
    const response = await axios.get(`${API_URL}/public/principal/noticias/antiguas`);
    return response.data;
}

const getNoticia = async (id: number) => {
    const response = await axios.get(`${API_URL}/public/principal/noticia/${id}`);
    return response.data;
}

const getNoticiasByCategoria = async (params: any) => {
    const response = await axios.get(`${API_URL}/public/principal/noticia/filtro`, {
        params: {
            titulo: params.titulo,
            consejero: params.consejero,
            comision: params.comision,
            tag: params.tag,
            fechaPublicacion: params.fechaPublicacion,
            page: params.page,
            size: params.size
        }
    });
    return response.data;
}

const getAgendas = async (mes: number) => {
    try {
        const response = await axios.get(`${API_URL}/public/principal/agendas/mes/${mes}`);
        return response.data;
    } catch (error) {
        console.error(`[PrincipalService] Error al obtener agendas del mes ${mes}:`, error);
        throw error;
    }
}

// Nueva función para cargar agendas con lazy loading
const getAgendasLazy = () => {
    let observer: IntersectionObserver | null = null;
    let loaded = false;

    return {
        loadWhenVisible: (element: Element | null, mes: number = new Date().getMonth() + 1) => {
            return new Promise((resolve, reject) => {
                // Si ya se cargaron los datos, devolver inmediatamente
                if (loaded) {
                    getAgendas(mes).then(resolve).catch(reject);
                    return;
                }

                // Si no hay elemento para observar, cargar inmediatamente
                if (!element) {
                    getAgendas(mes).then((data) => {
                        loaded = true;
                        resolve(data);
                    }).catch(reject);
                    return;
                }


                // Limpiar el observer anterior si existe
                if (observer) {
                    observer.disconnect();
                }

                // Crear un nuevo observer
                observer = new IntersectionObserver((entries) => {
                    const [entry] = entries;
                    if (entry.isIntersecting) {

                        // Desconectar el observer una vez que se detecta la intersección
                        observer?.disconnect();
                        observer = null;

                        // Cargar los datos
                        getAgendas(mes).then((data) => {
                            loaded = true;
                            resolve(data);
                        }).catch(reject);
                    }
                }, {
                    threshold: 0.1 // 10% del elemento debe ser visible
                });

                // Comenzar a observar el elemento
                observer.observe(element);
            });
        },

        // Método para recargar datos (p.ej. cuando cambia el mes)
        reload: (mes: number) => {
            loaded = false; // Resetear el estado para permitir una nueva carga
            return getAgendas(mes);
        }
    };
};

const getAnexoSgd = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/public/principal/documentos/anexo/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener anexos:', error);
        return [];
    }
}

const createAtencion = async (atencion: FormData) => {
    const response = await axios.post(`${API_URL}/public/principal/atenciones`, atencion, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

const getNoticiasConsejeros = async (id: number) => {
    const response = await axios.get(`${API_URL}/public/principal/noticias/consejeros/${id}`);
    return response.data;
}

const getNoticiasComisiones = async (id: number) => {
    const response = await axios.get(`${API_URL}/public/principal/noticias/comisiones/${id}`);
    return response.data;
}

const getDocumentosByTipo = async (id: number | null, codigo: string, page: number = 0, size: number = 10, search: string = '', anio: string = '', consejeroId: number | null = null, grupo: string = '') => {

    // console.log("Datos de getDocumentosByTipo: id =", id, "codigo =", codigo, "page =", page, "size =", size, "search =", search, "anio =", anio, "consejeroId =", consejeroId, "grupo =", grupo);


    if (!id) {
        return { content: [], totalElements: 0, totalPages: 0 };
    }

    // console.log("222 Datos de getDocumentosByTipo: id =", id, "codigo =", codigo, "page =", page, "size =", size, "search =", search, "anio =", anio, "consejeroId =", consejeroId, "grupo =", grupo);

    const response = await axios.get(`${API_URL}/public/principal/documentos/tipo/${id}`, {
        params: {
            page,
            size,
            search,
            anio,
            consejeroId,
            grupo
        }
    });

    // console.log("response::::::::::::::", response)
    return response.data;
}

const getAnuncioActivo = async () => {
    const response = await axios.get(`${API_URL}/public/principal/anuncios`);
    return response.data;
}

const getGaleriaConsejeros = async (id: number, page: number = 0, size: number = 10, orderBy: string = 'id', direction: string = 'asc') => {
    const response = await axios.get(`${API_URL}/public/principal/${id}/galeria-consejeros`, {
        params: {
            page,
            size,
            orderBy,
            direction
        }
    });
    return response.data;
}

const getGaleriaUltimos = async (id: number) => {
    const response = await axios.get(`${API_URL}/public/principal/${id}/galeria-consejeros/ultimos`);
    return response.data;
}


export default {
    getAllPrincipal,
    getAllLinkInteres,
    getAllServicios,
    getParametro,
    getAnuncio,
    getAllConsejeros,
    getAllComisiones,
    getConsejeroComision,
    getActividades,
    getImagenesActividad,
    getDocumentos,
    getTiposDocumentos,
    getNoticias,
    getBoletines,
    getNoticiaDestacada,
    getNoticiaUltimas,
    getNoticiasBreves,
    getNoticiaImagenes,
    getNoticiaUltimasPrincipales,
    getNoticiasImportantesAnteriores,
    getNoticia,
    getNoticiasByCategoria,
    getConsejero,
    getAgendas,
    getAgendasLazy,
    getAnexoSgd,
    createAtencion,
    getNoticiasConsejeros,
    getNoticiasComisiones,
    getDocumentosByTipo,
    getAnuncioActivo,
    getGaleriaConsejeros,
    getGaleriaUltimos
};
