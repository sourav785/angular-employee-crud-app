import { Component, OnInit, WritableSignal, effect, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { EmployeeSelectors, EmployeesActions } from '../../states/employee';
import { AppState } from '../../states/app.state';
import { ColumnDataType, ColumnDetails, Employee, TableConfigurationDetails } from '../models/employee.models';
import { EmployeeSignalStore } from "../../store/employee.signal-store";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {

  employeeSignalStore =inject(EmployeeSignalStore);

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
 
  tableConfig = signal<TableConfigurationDetails>({
    showActionColumn: true,
    showEditButton: true,
    showDeleteButton: true,
  });


  public rowDetails: WritableSignal<Employee[]> = signal([]);
  isEmployeeAddModalOpen = false;
  isEmployeeDeleteModalOpen = false;
  employee: Employee | null = null;
  selectedEmployeeId: number | undefined = undefined;
  employeeIdToDelete: number | undefined = undefined;

  constructor(
    private store: Store<AppState>
  ) {
    effect(() => {
      if(this.employeeSignalStore.employees()?.length){
        this.rowDetails.set(this.employeeSignalStore.employees());
        this.closeEmployeeAddModal();
      }
    }, {allowSignalWrites: true});
  }

  ngOnInit(): void {
    this._getEmployeeList();
    // this.store
    //   .select(EmployeeSelectors.selectAllEmployees)
    //   .subscribe((employees) => {
    //     this.rowDetails.set(employees);
    //     this.closeEmployeeAddModal();
    //   });
  }

  private _getEmployeeList(): void {
    //this.store.dispatch(EmployeesActions.loadEmployees());
    this.employeeSignalStore.loadEmployees();

  }

  openEmployeeAddModal(employee?: Employee): void {
    if (employee) {
      //this.employee = employee;
      this.selectedEmployeeId = employee.id;
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
      this.employeeSignalStore.deleteEmployee( <number>this.employeeIdToDelete );
      //this.store.dispatch(EmployeesActions.deleteEmployees({ id: <number>this.employeeIdToDelete }));
    }
    this.employeeIdToDelete = undefined;
  }
}
