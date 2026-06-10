import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  teamName: string;
  isActive: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserAdmin[]> {
    return this.http.get<UserAdmin[]>(this.apiUrl);
  }

  toggleActive(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/toggle-active`, {});
  }
}
