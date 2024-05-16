import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Signal,
  WritableSignal,
  computed,
  model,
  signal,
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})

export class EmployeeFormComponent implements OnInit, OnDestroy {
  @Input() data!: Employee|null;
  @Output() closeModalOutputFromForm: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  employeeForm: FormGroup;

  passwordInputType: string = 'password';


  firstName: string = '';
  lastName: string = '';
  fullName: string = '';

  firstNameSignal: WritableSignal<string> = model('');
  lastNameSignal: WritableSignal<string> = model('');
  fullNameSignal: Signal<string> = computed(() => `${this.firstNameSignal()} ${this.lastNameSignal()}` );

  first_name = signal('');
  last_name = signal('');


  public subs: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private store: Store<AppState>
  ) {
    this.employeeForm = this.formBuilder.group({
      FirstName: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      DOB: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.employeeForm.patchValue(this.data);
    }

    let firstNameChangesub = this.employeeForm.get('FirstName')?.valueChanges.subscribe((value) => {
      this.generateFullNameFromForm();
    });

    this.subs.push(firstNameChangesub!);

    let lastNameChangesub = this.employeeForm.get('LastName')?.valueChanges.subscribe((value) => {
      this.generateFullNameFromForm();
    });

    this.subs.push(lastNameChangesub!);
  }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

  generateFullNameFromForm() {
    this.fullName = this.employeeForm.get('FirstName')?.value + ' ' + this.employeeForm.get('LastName')?.value;
  }

  generateFullNameFromNgModel() {
    this.fullName = this.firstName + ' ' + this.lastName;
  }

  onSave(): void {
    if (this.employeeForm.valid) {
      if (this.data) {
         this.store.dispatch(EmployeesActions.updateEmployees({ employee: {id: this.data.id, ...this.employeeForm.value} }));
         
      } else {
        this.store.dispatch(EmployeesActions.addEmployees({ employee: this.employeeForm.value }));
      }
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  closeModal(updateData: boolean) {
    this.closeModalOutputFromForm.emit(updateData);
  }

  togglePassword() {
    this.passwordInputType =
      this.passwordInputType === 'password' ? 'text' : 'password';
  }

  changeFirstName(fname: any){
    this.first_name.set(fname);
  }
  changeLastName(lname: any){
    this.last_name.set(lname);
  }
  full_name = computed(()=>{
    return this.first_name() + ' ' + this.last_name()
  });
}
