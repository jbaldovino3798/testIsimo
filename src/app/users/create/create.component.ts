import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {

  form!: FormGroup;
  fortalezaContrasena: string = '';
  contrasenaCumpleCriterios: boolean = false;
  loading: boolean = false;

  constructor(
    public userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZÁáÀàÉéÈèÍíÌìÓóÒòÚúÙùÑñüÜ \-\']+')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });

  }

  actualizarFortalezaContrasena(event: any) {
    const contrasena = event?.target?.value;
    if (!contrasena) {
      return; // Salir si la contraseña es nula o vacía
    }
    let fortaleza = 0;

    // Verificar longitud mínima
    if (contrasena.length >= 8) {
      fortaleza++;
    }

    // Verificar presencia de caracteres especiales, letras mayúsculas, letras minúsculas y números
    const tieneCaracterEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(contrasena);
    const tieneMayuscula = /[A-Z]/.test(contrasena);
    const tieneMinuscula = /[a-z]/.test(contrasena);
    const tieneNumero = /[0-9]/.test(contrasena);

    if (tieneCaracterEspecial) {
      fortaleza++;
    }
    if (tieneMayuscula) {
      fortaleza++;
    }
    if (tieneMinuscula) {
      fortaleza++;
    }
    if (tieneNumero) {
      fortaleza++;
    }

    // Asignar la fortaleza de la contraseña
    switch (fortaleza) {
      case 1:
        this.fortalezaContrasena = "Muy débil";
        break;
      case 2:
        this.fortalezaContrasena = "Débil";
        break;
      case 3:
        this.fortalezaContrasena = "Moderada";
        break;
      case 4:
        this.fortalezaContrasena = "Fuerte";
        break;
      case 5:
        this.fortalezaContrasena = "Muy fuerte";
        break;
    }

    // Verificar si la contraseña cumple los criterios (por ejemplo, si la fortaleza es "Muy fuerte")
    this.contrasenaCumpleCriterios = this.fortalezaContrasena === "Muy fuerte";
  }

  get f() {
    return this.form.controls;
  }

  getBackgroundColor(): string {
    switch (this.fortalezaContrasena) {
      case 'Muy débil':
        return '#FFCCCC'; // Rojo claro para 'Muy débil'
      case 'Débil':
        return '#FFD699'; // Naranja claro para 'Débil'
      case 'Moderada':
        return '#FFFF99'; // Amarillo claro para 'Moderada'
      case 'Fuerte':
        return '#99FFCC'; // Verde claro para 'Fuerte'
      case 'Muy fuerte':
        return '#00FF00'; // Verde brillante para 'Muy fuerte'
      default:
        return ''; // Sin color por defecto
    }
  }


  submit() {
    // Mostrar el indicador de carga
    this.loading = true;
  
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => {
        control.markAllAsTouched();
        Swal.fire({
          title: 'Campos Obligatorios',
          icon: 'error',
          allowOutsideClick: false,
        });
      });
  
      // Ocultar el indicador de carga
      this.loading = false; // Oculta la barra de carga
      return;
    }
  
    this.userService.create(this.form.value)
      .pipe(
        finalize(() => {
          // Ocultar el indicador de carga al finalizar la solicitud
          this.loading = false;
        })
      )
      .subscribe((res: any) => {
        if (res.validate) {
          // Mostrar la barra de carga para errores de validación
          this.loading = true;
          // Si hay errores de validación en la respuesta
          if (res.validate.email) {
            Swal.fire({
              title: 'Error',
              text: res.validate.email[0], // Muestra el primer mensaje de error del email
              icon: 'error',
            });
          }
          if (res.validate.password) {
            Swal.fire({
              title: 'Error',
              text: res.validate.password[0], // Muestra el primer mensaje de error de la contraseña
              icon: 'error',
            });
          }
          // Ocultar la barra de carga después de mostrar los mensajes de error
          this.loading = false;
        } else {
          // Si la respuesta no tiene errores de validación
          Swal.fire({
            title: 'Registro Exitoso',
            icon: 'success'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('users');
              this.form.reset();
            }
          });
        }
      }, (error) => {
        // Manejo de errores de la solicitud HTTP
        console.error('Error:', error);
        // Ocultar la barra de carga en caso de error
        this.loading = false;
        Swal.fire({
          title: 'Error',
          text: 'Error guardando Registro',
          icon: 'error',
        });
      });
  }
  


}