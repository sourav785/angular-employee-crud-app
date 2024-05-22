import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
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

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})

export class EmployeeFormComponent implements OnInit {
  @Input() data!: Employee | null;
  @Output() closeModalOutputFromForm: EventEmitter<boolean> = new EventEmitter<boolean>();

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
  }

  ngOnInit(): void {
    if (this.data) {
      this.tableForm.patchValue(this.data);
    }
  }

  onSave(): void {
    if (this.tableForm.valid) {
      if (this.data) {
         this.store.dispatch(EmployeesActions.updateEmployees({ employee: {id: this.data.id, ...this.tableForm.value} }));
         
      } else {
        this.store.dispatch(EmployeesActions.addEmployees({ employee: this.tableForm.value }));
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
