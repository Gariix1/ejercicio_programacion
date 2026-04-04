import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/api.config';
import { Employee } from '../models/employee.model';

interface EmployeesResponse {
  data: Employee[];
}

@Injectable({ providedIn: 'root' })
export class EmployeesApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string,
  ) {}

  list(): Observable<Employee[]> {
    return this.http
      .get<EmployeesResponse>(`${this.apiBaseUrl}/employees`)
      .pipe(map((response) => response.data));
  }
}
