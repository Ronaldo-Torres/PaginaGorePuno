package com.rchila.backend.model.dto;

import java.util.List;
import com.rchila.backend.model.Consejero;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsejeroDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String dni;
    private String cargo;
    private String descripcion;
    private String correo;
    private String telefono;
    private String celular;
    private String direccion;
    private Boolean activo;
    private String provincia;
    private String url_imagen;
    private String documento;
    private List<ComisionDTO> comisiones;
    private List<NoticiaDTO> noticias;
    private List<DocumentoDTO> documentos;
    private String facebook;
    private String twitter;
    private String instagram;
    private String sexo;

    // alcaldes
    private String entidad;
    private String distrito;


    public ConsejeroDTO(Consejero consejero) {
        this.id = consejero.getId();
        this.nombre = consejero.getNombre();
        this.apellido = consejero.getApellido();
        this.dni = consejero.getDni();
        this.cargo = consejero.getCargo();
        this.descripcion = consejero.getDescripcion();
        this.correo = consejero.getCorreo();
        this.telefono = consejero.getTelefono();
        this.celular = null;
        this.direccion = consejero.getDireccion();
        this.activo = consejero.getActivo();
        this.provincia = consejero.getProvincia();
        this.url_imagen = consejero.getUrl_imagen();
        this.documento = consejero.getDocumento();
        this.comisiones = null;
        this.noticias = null;
        this.documentos = null;
        this.facebook = consejero.getFacebook();
        this.twitter = consejero.getTwitter();
        this.instagram = consejero.getInstagram();
        this.sexo = consejero.getSexo();

        // alcaldes
        this.entidad = consejero.getEntidad();
        this.distrito = consejero.getDistrito();
        
    }
}
