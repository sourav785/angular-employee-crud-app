import { createAction, props } from '@ngrx/store';
import { Employee } from '../../employee/models/employee.models';

export const loadEmployees = createAction('[Employee Page] Load Employees');
export const loadEmployeesSuccess = createAction('[Employee Page] Employee Load Success', props<{ employees: Employee[] }>());
export const loadEmployeesFailure = createAction('[Employee Page] Employee Load Failure', props<{ error: string }>());

export const addEmployees = createAction('[Employee Page] Add Employees', props<{ employee: Employee }>());
export const addEmployeesSuccess = createAction('[Employee Page] Employee Add Success', props<{ employee: Employee }>());
export const addEmployeesFailure = createAction('[Employee Page] Employee Add Failure', props<{ error: string }>());


export const deleteEmployees = createAction('[Employee Page] Delete Employees', props<{ id : number }>());
export const deleteEmployeesSuccess = createAction('[Employee Page] Employee Delete Success', props<{ id : number }>());
export const deleteEmployeesFailure = createAction('[Employee Page] Employee Delete Failure', props<{ error: string }>());


export const updateEmployees = createAction('[Employee Page] Update Employees', props<{ employee: Employee }>());
export const updateEmployeesSuccess = createAction('[Employee Page] Update Employee Success', props<{ employee: Employee }>());
export const updateEmployeesFailure = createAction('[Employee Page] Update Employee Failure', props<{ error: any }>());