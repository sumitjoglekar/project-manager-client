import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private baseUrl = 'http://localhost:8080/tasks';

  constructor(private http: HttpClient) { }

  getTask(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createTask(task: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, task);
  }

  updateTask(id: number, value: any): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, value);
  }

  getTasks(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getTasksByProject(projectId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search?projectId=${projectId}`);
  }
}
