import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/api.config';
import { Province } from '../models/province.model';

interface ProvincesResponse {
  data: Province[];
}

@Injectable({ providedIn: 'root' })
export class ProvincesApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string,
  ) {}

  list(): Observable<Province[]> {
    return this.http
      .get<ProvincesResponse>(`${this.apiBaseUrl}/provinces`)
      .pipe(map((response) => response.data));
  }
}
