import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, switchMap } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService {

  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.apiUrl}/employees`;

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  createEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {

    //Get all the employees and find the next id
    return this.getEmployees().pipe(
      switchMap((employees) => {
        const nextId =
          employees.reduce((maxId, current) => Math.max(maxId, Number(current.id) || 0), 0) + 1;

        return this.http.post<Employee>(this.apiUrl, {
          ...employee,
          id: nextId,
        });
      }),
    );
  }

  updateEmployee(id: number, employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, { ...employee, id });
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }
}
