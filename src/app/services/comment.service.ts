import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  id: string;
  commentText: string;
  createdAt: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly apiUrl = 'http://localhost:5000/api/comments';

  constructor(private http: HttpClient) { }

  getComments(pollId: string, page: number = 1, pageSize: number = 10): Observable<Comment[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<Comment[]>(`${this.apiUrl}/poll/${pollId}`, { params });
  }

  addComment(pollId: string, commentText: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/poll/${pollId}`, { commentText });
  }

  updateComment(id: string, commentText: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}`, { commentText });
  }

  deleteComment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
