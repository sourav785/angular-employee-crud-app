import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { EmployeeState } from './employee.reducers';

export const selectEmployees = (state: AppState) => state.employeesState;
export const selectAllEmployees = createSelector(
  selectEmployees,
  (state: EmployeeState) => state.employees
);
