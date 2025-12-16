package com.rchila.backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

import com.rchila.backend.service.ConsejeroService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import com.rchila.backend.model.Consejero;
/* import com.rosmelchila.backend.service.FileService; */
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/v1/consejeros")
@AllArgsConstructor
public class ConsejeroController {

    private final ConsejeroService consejeroService;

    /*
     * @Autowired
     * private FileService fileService;
     */

    @GetMapping
    public Page<Consejero> getConsejeros(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String search) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        return consejeroService.findAllConsejeros(PageRequest.of(page, size, Sort.by(sortDirection, orderBy)), search);
    }

    @GetMapping("/{id}")
    public Consejero getConsejeroById(@PathVariable Long id) {
        return consejeroService.findConsejeroById(id);
    }

    @PostMapping
    public ResponseEntity<Consejero> createConsejero(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "documento", required = false) MultipartFile documento,
            @RequestParam("cargo") String cargo,
            @RequestParam("dni") String dni,
            @RequestParam("nombre") String nombre,
            @RequestParam("apellido") String apellido,
            @RequestParam("descripcion") String descripcion,
            
            @RequestParam(value = "entidad", required = false) String entidad, // alcaldes
            @RequestParam(value = "provincia", required = false) String provincia,    
            @RequestParam(value = "distrito", required = false) String distrito,

            @RequestParam(value = "correo", required = false) String correo,
            @RequestParam(value = "telefono", required = false) String telefono,
            @RequestParam(value = "direccion", required = false) String direccion,
            @RequestParam(value = "facebook", required = false) String facebook,
            @RequestParam(value = "instagram", required = false) String instagram,
            @RequestParam(value = "twitter", required = false) String twitter,
            @RequestParam(value = "youtube", required = false) String youtube,
            @RequestParam(value = "tiktok", required = false) String tiktok,
            @RequestParam(value = "whatsapp", required = false) String whatsapp,
            @RequestParam(value = "telegram", required = false) String telegram,
            @RequestParam(value = "pinterest", required = false) String pinterest,
            @RequestParam(value = "snapchat", required = false) String snapchat,
            @RequestParam(value = "kick", required = false) String kick,
            @RequestParam(value = "twitch", required = false) String twitch,
            @RequestParam(value = "linkedin", required = false) String linkedin) {
        Consejero consejero = new Consejero();
        consejero.setCargo(cargo);
        consejero.setDni(dni);
        consejero.setNombre(nombre);
        consejero.setApellido(apellido);
        consejero.setDescripcion(descripcion);
        consejero.setCorreo(correo);
        consejero.setTelefono(telefono);
        consejero.setDireccion(direccion);

        consejero.setEntidad(entidad);
        consejero.setProvincia(provincia);
        consejero.setDistrito(distrito);

        consejero.setFacebook(facebook);
        consejero.setInstagram(instagram);
        consejero.setTwitter(twitter);
        consejero.setYoutube(youtube);
        consejero.setTiktok(tiktok);
        consejero.setWhatsapp(whatsapp);
        consejero.setTelegram(telegram);
        consejero.setPinterest(pinterest);
        consejero.setSnapchat(snapchat);
        consejero.setKick(kick);
        consejero.setTwitch(twitch);
        consejero.setLinkedin(linkedin);

        Consejero consejeroCreado = consejeroService.saveConsejero(file, documento, consejero);
        return new ResponseEntity<>(consejeroCreado, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public Consejero updateConsejero(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "documento", required = false) MultipartFile documento,
            @RequestParam(value = "cargo", required = false) String cargo,
            @RequestParam(value = "dni", required = false) String dni,
            @RequestParam(value = "nombre", required = false) String nombre,
            @RequestParam(value = "apellido", required = false) String apellido,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam(value = "correo", required = false) String correo,
            @RequestParam(value = "telefono", required = false) String telefono,
            @RequestParam(value = "direccion", required = false) String direccion,
            @RequestParam(value = "facebook", required = false) String facebook,
            @RequestParam(value = "instagram", required = false) String instagram,
            @RequestParam(value = "twitter", required = false) String twitter,
            @RequestParam(value = "youtube", required = false) String youtube,
            @RequestParam(value = "tiktok", required = false) String tiktok,
            @RequestParam(value = "whatsapp", required = false) String whatsapp,
            @RequestParam(value = "telegram", required = false) String telegram,
            @RequestParam(value = "pinterest", required = false) String pinterest,
            @RequestParam(value = "snapchat", required = false) String snapchat,
            @RequestParam(value = "kick", required = false) String kick,
            @RequestParam(value = "twitch", required = false) String twitch,
            @RequestParam(value = "linkedin", required = false) String linkedin) {
        Consejero consejero = new Consejero();
        consejero.setCargo(cargo);
        consejero.setDni(dni);
        consejero.setNombre(nombre);
        consejero.setApellido(apellido);
        consejero.setDescripcion(descripcion);
        consejero.setCorreo(correo);
        consejero.setTelefono(telefono);
        consejero.setDireccion(direccion);
        consejero.setFacebook(facebook);
        consejero.setInstagram(instagram);
        consejero.setTwitter(twitter);
        consejero.setYoutube(youtube);
        consejero.setTiktok(tiktok);
        consejero.setWhatsapp(whatsapp);
        consejero.setTelegram(telegram);
        consejero.setPinterest(pinterest);
        consejero.setSnapchat(snapchat);
        consejero.setKick(kick);
        consejero.setTwitch(twitch);
        consejero.setLinkedin(linkedin);

        return consejeroService.updateConsejero(id, file, documento, consejero);
    }

    @DeleteMapping("/{id}")
    public void deleteConsejero(@PathVariable Long id) {
        consejeroService.deleteConsejero(id);
    }

    @GetMapping("/all")
    public List<Consejero> getAllConsejeros() {
        return consejeroService.findAllConsejo();
    }

    @PostMapping("/{id}/activar")
    public Consejero activarConsejero(@PathVariable Long id, @RequestBody Consejero consejero) {
        return consejeroService.activarConsejero(id, consejero.getActivo());
    }

    // subida de foto
    /*
     * @PostMapping("/upload")
     * public ResponseEntity<Imagen> handleFileUpload(@RequestParam("file")
     * MultipartFile file, Consejero consejero) {
     * 
     * Imagen imagen = fileService.uploadFile(file, consejero);
     * return new ResponseEntity<>(imagen, HttpStatus.OK);
     * }
     */

    /*
     * @PutMapping("/update/{id}")
     * public ResponseEntity<Imagen> handleFileUpdate(
     * 
     * @PathVariable Long id,
     * 
     * @RequestParam("file") MultipartFile newFile) {
     * 
     * Imagen imagen = fileService.updateFile(id, newFile);
     * return new ResponseEntity<>(imagen, HttpStatus.OK);
     * }
     */

    /*
     * @DeleteMapping("/delete/{id}")
     * public ResponseEntity<String> handleFileDelete(@PathVariable Long id) {
     * try {
     * fileService.deleteFile(id);
     * return new ResponseEntity<>("Archivo eliminado correctamente.",
     * HttpStatus.OK);
     * } catch (IllegalArgumentException e) {
     * return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
     * } catch (Exception e) {
     * return new ResponseEntity<>("Error al eliminar el archivo.",
     * HttpStatus.INTERNAL_SERVER_ERROR);
     * }
     * }
     */
}
