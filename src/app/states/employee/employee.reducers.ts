import { createReducer, on } from '@ngrx/store';
import { Employee } from '../../employee/models/employee.models';
import { StateStatus } from '../../shared/model/shared.model';
import { EmployeesActions } from '.';
import { error } from 'console';

export interface EmployeeState {
  employees: Employee[];
  error: string | null;
  status: StateStatus;
}

export const initialState: EmployeeState = {
  employees: [],
  error: null,
  status: StateStatus.PENDING,
};

export const employeeReducer = createReducer(
  initialState,

  on(EmployeesActions.loadEmployees, (state) => ({
    ...state,
    status: StateStatus.LOADING,
  })),

  on(EmployeesActions.loadEmployeesSuccess, (state, { employees }) => ({
    ...state,
    employees: employees,
    error: null,
    status: StateStatus.SUCCESS,
  })),
  
  on(EmployeesActions.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: StateStatus.ERROR,
  })),

  on(EmployeesActions.deleteEmployees, (state) => ({
    ...state,
    status: StateStatus.LOADING, 
  })),

  on(EmployeesActions.deleteEmployeesSuccess, (state, { id  }) => ({
    ...state,
    employees: state.employees.filter((employee) => employee.id !== id),
    error: null,
    status: StateStatus.SUCCESS,
  })),

  on(EmployeesActions.deleteEmployeesFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: StateStatus.ERROR,
  })),

  on(EmployeesActions.addEmployees, (state, { employee }) => ({
    ...state,
    status: StateStatus.LOADING, 
  })),

  on(EmployeesActions.addEmployeesSuccess, (state, { employee }) => ({
    ...state,
    error: null,
    employees: [...state.employees, employee],
    status: StateStatus.SUCCESS,
  })),

  on(EmployeesActions.addEmployeesFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: StateStatus.ERROR,
  })),

  on(EmployeesActions.updateEmployees, (state) => ({
    ...state,
    status: StateStatus.LOADING, 
  })),

  on(EmployeesActions.updateEmployeesSuccess, (state, { employee }) => ({
    ...state,
    employees: state.employees.map(x => x.id === employee.id ? employee : x),
    error: null,
    status: StateStatus.SUCCESS,
  })),

  on(EmployeesActions.updateEmployeesFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: StateStatus.ERROR,
  }))
);
