import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../employee/models/employee.models';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly url = 'http://localhost:4000/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.url}`);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.url}/${id}`);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.url}`, { employee });
  }

  // PUT http://localhost:4000/employees/{id}
  updateEmployeeById(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.url}/${employee.id}`, { employee });
  }

  // DELETE http://localhost:4000/employees/{id}
  deleteEmployeeById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
