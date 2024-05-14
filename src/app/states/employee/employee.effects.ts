import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { EmployeeService } from '../../services/employee.service';
import { EmployeesActions } from '.';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class EmployeeEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private toastr: ToastrService,
    private employeeService: EmployeeService
  ) {}

  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.loadEmployees),
      switchMap(() =>
        from(this.employeeService.getEmployees()).pipe(
          map((employees) =>
            EmployeesActions.loadEmployeesSuccess({ employees: employees })
          ),
          catchError((error) =>
            of(EmployeesActions.loadEmployeesFailure({ error }))
          )
        )
      )
    )
  );

  deleteEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.deleteEmployees),
      map(action => action.id),
      switchMap((id) =>
        from(this.employeeService.deleteEmployeeById(id)).pipe(
          tap(() => this.toastr.success('Employee Deleted!')),
            map((employees) => EmployeesActions.deleteEmployeesSuccess({ id })),
            catchError((error) => of(EmployeesActions.deleteEmployeesFailure({ error })))
          )
        )
      )  
    );

    addEmployee$ = createEffect(() =>
      this.actions$.pipe(
        ofType(EmployeesActions.addEmployees),
        map(action => action.employee),
        switchMap((employees) =>
          from(this.employeeService.createEmployee(employees)).pipe(
            tap(() => this.toastr.success('New Employee Created!')),
            map((response) => EmployeesActions.addEmployeesSuccess({ employee: response })),
            catchError((error) =>
              of(EmployeesActions.addEmployeesFailure({ error }))
            )
          )
        )
      )
    );

    updateEmployee$ = createEffect(() =>
      this.actions$.pipe(
        ofType(EmployeesActions.updateEmployees),
        map(action => action.employee),
        switchMap((employee) =>
          this.employeeService.updateEmployeeById(employee).pipe(
            tap(() => this.toastr.success('Employee Updated!')),
            map((response) => EmployeesActions.updateEmployeesSuccess({ employee: response })),
            catchError((error) =>
              of(EmployeesActions.updateEmployeesFailure({ error }))
            )
          )
        )
      )
    );
}
