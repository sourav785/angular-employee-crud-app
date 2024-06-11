import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  effect,
  inject,
  input
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../../services/employee.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Employee } from '../../models/employee.models';
import { Store } from '@ngrx/store';
import { EmployeesActions } from '../../../states/employee';
import { AppState } from '../../../states/app.state';
import { EmployeeSignalStore } from '../../../store/employee.signal-store';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})

export class EmployeeFormComponent implements OnInit {
  //@Input() data!: Employee | null;
  //@Input() employeeId!: number | undefined;
  employeeId = input.required<number | undefined>();
  @Output() closeModalOutputFromForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  employeeSignalStore = inject(EmployeeSignalStore);

  tableForm: FormGroup;

  passwordInputType: string = 'password';

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private store: Store<AppState>
  ) {
    this.tableForm = this.formBuilder.group({
      FirstName: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      DOB: new FormControl('', [Validators.required]),
    });

    effect(() => {
      if(this.employeeSignalStore.selectedEmployee()){
        this.tableForm.patchValue(<any>this.employeeSignalStore.selectedEmployee());
      } else {
        this.tableForm.reset();
      }
    });
    effect(() => {
      if(this.employeeId()){
        this.employeeSignalStore.updateEmployeeId(<any>this.employeeId());
      } else {
        this.tableForm.reset();
      }
    }, {allowSignalWrites: true});
  }

  ngOnInit(): void {
    const selectedId = this.employeeSignalStore.employeeID;
    this.employeeSignalStore.getEmployeeById(selectedId);
  }

  onSave(): void {
    if (this.tableForm.valid) {
      if (this.employeeId()) {
        this.employeeSignalStore.editEmployee({id: this.employeeId(), ...this.tableForm.value});
      } else {
        this.employeeSignalStore.addEmployee(this.tableForm.value);
      }
    } else {
      this.tableForm.markAllAsTouched();
    }
  }

  closeModal(updateData: boolean) {
    this.closeModalOutputFromForm.emit(updateData);
  }

  togglePassword() {
    this.passwordInputType =
      this.passwordInputType === 'password' ? 'text' : 'password';
  }
}
