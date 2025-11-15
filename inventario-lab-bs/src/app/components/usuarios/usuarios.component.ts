import { Component } from '@angular/core';
import { ConfirmationService, MessageService} from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { InputGroupModule } from 'primeng/inputgroup';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { FluidModule } from 'primeng/fluid';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { UsuarioService } from '../../services/usuarios.service';
import { Dialog } from 'primeng/dialog';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    TableModule,
    MultiSelectModule,
    SelectModule,
    DropdownModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    FluidModule,
    DatePickerModule,
    AutoCompleteModule,
    ConfirmDialog,
    Dialog,
    InputGroupModule
  ],
  providers: [MessageService, ConfirmationService, UsuarioService],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  usuarios: any[] = [];
  mostrarDialogo: boolean = false;
  mostrarDialogoContrasena: boolean = false;
  formUsuario!: FormGroup;
  formContrasena!: FormGroup;
  mostrarPassword: boolean = false;
  mostrarConfirmacion: boolean = false;
  mostrarNueva: boolean = false;
  mostrarConfirmar: boolean = false;

  usuarioSeleccionado: any = null;

  roles = [
    { label: 'Administrador', value: 'Administrador' },
    { label: 'Personal Operativo', value: 'Invitado' },
  ];

  constructor(
    private fb: FormBuilder, 
    private usuariosService: UsuarioService, 
    private messageService: MessageService,
    private confirmationService: ConfirmationService
) {}

  ngOnInit(): void {
    this.cargarUsuarios();

    this.formUsuario = this.fb.group({
      nombre_usuario: ['', Validators.required],
      rol: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(5)]],
      confirmarContrasena: ['', Validators.required],
      nombre_completo: ['']
    }, {
      validators: this.validarCoincidencia
    });

    this.formContrasena = this.fb.group({
      contrasena_actual: [''],
      nueva_contrasena: ['', [Validators.required, Validators.minLength(5)]],
      confirmar_contrasena: ['', Validators.required],
    }, { validators: this.validarCoincidenciaNueva });

    // Escucha cambios en el campo "rol"
    this.formUsuario.get('rol')?.valueChanges.subscribe((rol) => {
      const nombreCompletoControl = this.formUsuario.get('nombre_completo');
      if (rol === 'Administrador') {
        nombreCompletoControl?.setValidators([Validators.required]);
      } else {
        nombreCompletoControl?.clearValidators();
        nombreCompletoControl?.reset();
      }
      nombreCompletoControl?.updateValueAndValidity();
    });
  }

  cargarUsuarios() {
      this.usuariosService.getUsuarios()
        .subscribe({
          next: (data) => {
            this.usuarios = data;
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios' })
        });
  }

  abrirDialogo() {
    this.formUsuario.reset();
    this.mostrarDialogo = true;
  }

  abrirDialogoContrasena(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.formContrasena.reset();
    this.mostrarDialogoContrasena = true;
  }

  cerrarDialogo() {
    this.mostrarDialogo = false;
  }

  cerrarDialogoContrasena() {
    this.mostrarDialogoContrasena = false;
  }

  guardarUsuario() {
    if (this.formUsuario.invalid) return;

    const nuevoUsuario = this.formUsuario.value;
    delete nuevoUsuario.confirmarContrasena;

    this.usuariosService.crearUsuario(nuevoUsuario).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente' });
        this.cargarUsuarios();
        this.cerrarDialogo();
      },
      error: (e) => {
        const msg = e.error?.message || 'No se pudo crear el usuario';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
      }
    });
  }

  cambiarContrasena() {
    if (this.formContrasena.invalid || !this.usuarioSeleccionado) return;

    const data = this.formContrasena.value;
    this.usuariosService.cambiarContrasena(this.usuarioSeleccionado.id_usuario, data).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: res.message });
        this.cerrarDialogoContrasena();
      },
      error: (e) => {
        const msg = e.error?.message || 'No se pudo cambiar la contraseña';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
      },
    });
  }

  validarCoincidencia = (form: FormGroup) => {
    const pass = form.get('contrasena')?.value;
    const confirm = form.get('confirmarContrasena')?.value;
    return pass === confirm ? null : { noCoinciden: true };
  }

  validarCoincidenciaNueva = (form: FormGroup) => {
    const pass = form.get('nueva_contrasena')?.value;
    const confirm = form.get('confirmar_contrasena')?.value;
    return pass === confirm ? null : { noCoinciden: true };
  };

  confirmarEliminarUsuario(usuario: any) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar al usuario "${usuario.nombre_usuario}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      accept: () => {
        this.eliminarUsuario(usuario.id_usuario);
      }
    });
  }

  eliminarUsuario(id: number) {
    this.usuariosService.eliminarUsuario(id).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: res.message });
        this.cargarUsuarios();
      },
      error: (e) => {
        const msg = e.error?.message || 'No se pudo eliminar el usuario';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
      }
    });
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleConfirmacion() {
    this.mostrarConfirmacion = !this.mostrarConfirmacion;
  }

  toggleNueva() { 
    this.mostrarNueva = !this.mostrarNueva; 
  }

  toggleConfirmar() { 
    this.mostrarConfirmar = !this.mostrarConfirmar; 
  }
}
