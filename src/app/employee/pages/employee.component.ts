import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../models/employee.models';
import { Store } from '@ngrx/store';
import { EmployeeSelectors, EmployeesActions } from '../../states/employee';
import { AppState } from '../../states/app.state';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnInit {
  public employees: Employee[] = [];
  isEmployeeAddModalOpen = false;
  isEmployeeDeleteModalOpen = false;
  employee: Employee|null = null;
  employeeIdToDelete: number|undefined = undefined;

  constructor(
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this._getEmployeeList();
    this.store
      .select(EmployeeSelectors.selectAllEmployees)
      .subscribe((employees) => {
        this.employees = employees;
        this.closeEmployeeAddModal();
      });
  }

  private _getEmployeeList(): void {
    // this.employeeService.getEmployees().subscribe((employeesData) => {
    //   this.employees = employeesData;
    // });
    this.store.dispatch(EmployeesActions.loadEmployees());
  }

  openEmployeeAddModal(): void {
    this.isEmployeeAddModalOpen = true;
  }

  closeEmployeeAddModal(event?: boolean): void {
    this.employee = null;
    this.isEmployeeAddModalOpen = false;
    // if (event) this._getEmployeeList();
  }

  openEmployeeDeleteModal(id: number|undefined): void {
    this.employeeIdToDelete = id;
    this.isEmployeeDeleteModalOpen = true;
  }

  onDeleteConfirmed(confirmed: boolean) {
    this.isEmployeeDeleteModalOpen = false;
    if (confirmed) {
      // Perform delete action
      this.store.dispatch(EmployeesActions.deleteEmployees({ id: <number>this.employeeIdToDelete}));
    }
    this.employeeIdToDelete = undefined;
  }

  onDelete(id: number): void {
    this.store.dispatch(EmployeesActions.deleteEmployees({id}));
    // this.employeeService.deleteEmployeeById(id).subscribe({
    //   next: (response) => {
    //     this.toastr.success('Employee Deleted!');
    //     this._getEmployeeList();
    //   },
    //   error: (error) => {
    //     console.error('Error deleting employee:', error);
    //   },
    // });
  }


  loadEmployee(employee: Employee) {
    this.employee = employee;
    this.openEmployeeAddModal();
  }
}
