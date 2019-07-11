import { Injectable } from '@angular/core';
import { Employee } from '../model/model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  readonly path = "http://192.168.2.113:8080";

  getAll(): Observable<Array<Employee>> {
    return this.http.get<Array<Employee>>(this.path + "/employees");
  }

  getById(e): Observable<Employee> {
    return this.http.get<Employee>(this.path + "/employees/" + e.value.id);
  }

  postEmployee(e: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.path + "/employees", e);
  }

  putEmployee(e: Employee): Observable<Employee> {
    return this.http.put<Employee>(this.path + "/employees/" + e.id, e);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(this.path + "/employees/" + id);
  }
}
