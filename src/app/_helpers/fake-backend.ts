import {
  HttpRequest,
  HttpResponse,
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered employee
const employeesKey = 'angular-tutorial-employees';
let employees: any[] = JSON.parse(localStorage.getItem(employeesKey)!) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/employees') && method === 'GET':
          return getEmployees();
        case url.match(/\/employees\/\d+$/) && method === 'GET':
          return getEmployeesById();
        case url.match('/employees') && method === 'POST':
          return createEmployee();
        case url.match(/\/employees\/\d+$/) && method === 'PUT':
          return updateEmployee();
        case url.match(/\/employees\/\d+$/) && method === 'DELETE':
          return deleteEmployees();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function getEmployees() {
      return ok(employees.map((x) => basicDetails(x)));
    }

    function getEmployeesById() {
      const employee = employees.find((x) => x.id === idFromUrl());
      return ok(basicDetails(employee));
    }

    function createEmployee() {
      let employee = { ...body.employee };

      if (employees.find((x) => x.Email === employee.Email)) {
        return error('Email "' + employee.Email + '" is already taken');
      }

      employee.id = employees.length
        ? Math.max(...employees.map((x) => x.id)) + 1
        : 1;
        
      employees.push(employee);
      localStorage.setItem(employeesKey, JSON.stringify(employees));
      return ok(employee);
    }

    function updateEmployee() {
      let params = body.employee;
      let employee = employees.find((x) => x.id === idFromUrl());

      // update and save employee
      Object.assign(employee, params);
      localStorage.setItem(employeesKey, JSON.stringify(employees));

      return ok(employee);
    }

    function deleteEmployees() {
      employees = employees.filter((x) => x.id !== idFromUrl());
      localStorage.setItem(employeesKey, JSON.stringify(employees));
      return ok(idFromUrl());
    }

    // helper functions

    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
    }

    function error(message: string) {
      return throwError(() => ({ error: { message } })).pipe(
        materialize(),
        delay(500),
        dematerialize()
      ); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }

    function basicDetails(employee: any) {
      const { id, FirstName, LastName, Email, DOB, Password } = employee;
      return { id, FirstName, LastName, Email, DOB, Password };
    }
  }
}
