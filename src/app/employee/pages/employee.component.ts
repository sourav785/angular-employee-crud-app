import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { EmployeeSelectors, EmployeesActions } from '../../states/employee';
import { AppState } from '../../states/app.state';
import { ColumnDataType, ColumnDetails, Employee } from '../models/employee.models';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {

  columnDetails: WritableSignal<ColumnDetails[]> = signal([
    {
      name: "ID",
      key: "id",
      dataType: ColumnDataType.Text,
    },
    {
      name: "First Name",
      key: "FirstName",
      dataType: ColumnDataType.Text,
    },
    {
      name: "Last Name",
      key: "LastName",
      dataType: ColumnDataType.Text
    },
    {
      name: "Email",
      key: "Email",
      dataType: ColumnDataType.Text
    },
    {
      name: "DOB",
      key: "DOB",
      dataType: ColumnDataType.Date,
      dateFormat: 'EEEE, MMMM d, y, h:mm:ss a zzzz'
    }
  ]);

  tableConfig = {
    showActionColumn: true,
    showEditButton: true,
    showDeleteButton: true,
  }

  actions = {
    showActionColumn: true,
    showEditButton: true,
    // editEmployee: {
    //   action: (employee: Employee) => this.openEmployeeAddModal(employee),
    //   text: 'Edit',
    //   styles: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
    // },
    showDeleteButton: true,
    // deleteEmployee: {
    //   action: (id: number) => this.openEmployeeDeleteModal(id),
    //   text: 'Delete',
    //   styles: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
    // }
  };

  public rowDetails: WritableSignal<Employee[]> = signal([]);
  isEmployeeAddModalOpen = false;
  isEmployeeDeleteModalOpen = false;
  employee: Employee | null = null;
  employeeIdToDelete: number | undefined = undefined;

  constructor(
    private toastr: ToastrService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this._getEmployeeList();
    this.store
      .select(EmployeeSelectors.selectAllEmployees)
      .subscribe((employees) => {
        this.rowDetails.set(employees);
        this.closeEmployeeAddModal();
      });
  }

  private _getEmployeeList(): void {
    this.store.dispatch(EmployeesActions.loadEmployees());
  }

  openEmployeeAddModal(employee?: Employee): void {
    if (employee) {
      this.employee = employee;
    }
    this.isEmployeeAddModalOpen = true;
  }

  closeEmployeeAddModal(event?: boolean): void {
    this.employee = null;
    this.isEmployeeAddModalOpen = false;
  }

  openEmployeeDeleteModal(id: number | undefined): void {
    this.employeeIdToDelete = id;
    this.isEmployeeDeleteModalOpen = true;
  }

  onDeleteConfirmed(confirmed: boolean): void {
    this.isEmployeeDeleteModalOpen = false;
    if (confirmed) {
      this.store.dispatch(EmployeesActions.deleteEmployees({ id: <number>this.employeeIdToDelete }));
    }
    this.employeeIdToDelete = undefined;
  }
}
