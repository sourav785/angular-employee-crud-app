import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { Employee } from "../employee/models/employee.models";
import { StateStatus } from "../shared/model/shared.model";
import { Injectable, inject } from "@angular/core";
import { EmployeeService } from "../services/employee.service";
import { filter, pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/component-store";
import { ToastrService } from "ngx-toastr";

interface EmployeeState {
    employees: Employee[];
    employeeID: number | null;
    selectedEmployee: Employee | null;
    error: string | null;
    status: StateStatus;
}

const initialState: EmployeeState = {
    employees: [],
    employeeID: null,
    selectedEmployee: null,
    error: null,
    status: StateStatus.PENDING,
};

export const EmployeeSignalStore = signalStore(
    //{ providedIn: 'root' },
    withState(initialState),
    withMethods((store, employeeService = inject(EmployeeService), toastr = inject(ToastrService)) => ({
        updateEmployeeId(id:number): void{
            patchState(store, (state) => ({
                employeeID: id
            }));
        },
        loadEmployees: rxMethod<void>(
            pipe(
                tap(() => patchState(store,(state) => ({status: StateStatus.LOADING}))),
                switchMap(() => {
                    return employeeService.getEmployees().pipe(
                        tapResponse({
                            next: (response) => {
                                patchState(store, (state) => ({
                                    employees: response
                                }));
                            },
                            error: (error) => {
                                console.log("Error");
                                patchState(store, (state) => ({status: StateStatus.ERROR}));
                            },
                            finalize: () => {
                                patchState(store, (state) => ({status: StateStatus.SUCCESS}));
                            }
                        })
                    );
                }),

            ),
        ),
        deleteEmployee: rxMethod<number>(
            pipe(
                filter((x) => !!x),
                tap(() => patchState(store,(state) => ({status: StateStatus.LOADING}))),
                switchMap((id) => {
                    return employeeService.deleteEmployeeById(id).pipe(
                        tapResponse({
                            next: (response) => {
                                patchState(store, (state) => ({
                                    employees: [...state.employees.filter((employee) => employee.id !== id)],
                                }));
                                toastr.success('Employee Deleted!');
                            },
                            error: (error) => {
                                console.log("Error");
                                patchState(store, (state) => ({status: StateStatus.ERROR}));
                                toastr.error('Employee Delete Error!');
                            },
                            finalize: () => {
                                patchState(store, (state) => ({status: StateStatus.SUCCESS}));
                            }
                        })
                    );
                }),

            ),
        ),
        addEmployee: rxMethod<Employee>(
            pipe(
                filter((x) => !!x),
                tap(() => patchState(store,(state) => ({status: StateStatus.LOADING}))),
                switchMap((request) => {
                    return employeeService.createEmployee(request).pipe(
                        tapResponse({
                            next: (response) => {
                                patchState(store, (state) => ({
                                    employees: [...state.employees, response],
                                }));
                                toastr.success('Employee Added!');
                            },
                            error: (error) => {
                                console.log("Error");
                                patchState(store, (state) => ({status: StateStatus.ERROR}));
                                toastr.error('Employee Add Error!');
                            },
                            finalize: () => {
                                patchState(store, (state) => ({status: StateStatus.SUCCESS}));
                            }
                        })
                    );
                }),

            ),
        ),
        editEmployee: rxMethod<Employee>(
            pipe(
                filter((x) => !!x),
                tap(() => patchState(store,(state) => ({status: StateStatus.LOADING}))),
                switchMap((request) => {
                    return employeeService.updateEmployeeById(request).pipe(
                        tapResponse({
                            next: (response) => {
                                patchState(store, (state) => ({
                                    employees: [...state.employees.map(x => x.id === response.id ? response : x)],
                                }));
                                toastr.success('Employee Edited!');
                            },
                            error: (error) => {
                                console.log("Error");
                                patchState(store, (state) => ({status: StateStatus.ERROR}));
                                toastr.error('Employee Edit Error!');
                            },
                            finalize: () => {
                                patchState(store, (state) => ({status: StateStatus.SUCCESS}));
                            }
                        })
                    );
                }),
            ),
        ),

        getEmployeeById: rxMethod<number | null>(
            pipe(
                filter((x) => !!x),
                tap(() => patchState(store,(state) => ({status: StateStatus.LOADING , selectedEmployee: null }))),
                switchMap((id) => {
                    return employeeService.getEmployeeById(id).pipe(
                        tapResponse({
                            next: (response) => {
                                patchState(store, (state) => ({
                                    selectedEmployee: response
                                }));
                            },
                            error: (error) => {
                                console.log("Error");
                                patchState(store, (state) => ({status: StateStatus.ERROR}));
                                toastr.error('Employee Getting Error!');
                            },
                            finalize: () => {
                                patchState(store, (state) => ({status: StateStatus.SUCCESS}));
                            }
                        })
                    );
                }),
            ),
        ),
    }))  
)