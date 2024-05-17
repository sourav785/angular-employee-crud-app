import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './pages/employee.component';
import { EmployeeRoutingModule } from './employee.routing';
import { ModalComponent } from '../shared/modal/modal.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';

@NgModule({
  declarations: [EmployeeComponent, EmployeeFormComponent, EmployeeTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeeRoutingModule,
    ModalComponent
  ],
  providers: [],
})
export class EmployeeModule {}
