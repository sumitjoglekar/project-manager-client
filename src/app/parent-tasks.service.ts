import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParentTasksService {

  private baseUrl = 'http://localhost:8080/parent/tasks';

  constructor(private http: HttpClient) { }

  getParentTasks(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  createParentTask(task: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, task);
  }

  getParentTask(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
