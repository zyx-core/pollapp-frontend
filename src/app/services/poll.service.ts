import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PollOption {
  id: string;
  optionText: string;
  votesCount: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  votingEnabled: boolean;
  commentsEnabled: boolean;
  resultsPublished: boolean;
  startDate: string;
  endDate: string;
  status: string;
  totalVotes: number;
  totalComments: number;
  creator: any;
  options: PollOption[];
}

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private readonly apiUrl = 'http://localhost:5000/api/polls';
  private readonly votesUrl = 'http://localhost:5000/api/votes';

  constructor(private http: HttpClient) { }

  getPolls(page: number = 1, pageSize: number = 10, search?: string, sort?: string): Observable<Poll[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (search) params = params.set('search', search);
    if (sort) params = params.set('sort', sort);

    return this.http.get<Poll[]>(this.apiUrl, { params });
  }

  getPollById(id: string): Observable<Poll> {
    return this.http.get<Poll>(`${this.apiUrl}/${id}`);
  }

  createPoll(data: any): Observable<Poll> {
    return this.http.post<Poll>(this.apiUrl, data);
  }

  updatePoll(id: string, data: any): Observable<Poll> {
    return this.http.put<Poll>(`${this.apiUrl}/${id}`, data);
  }

  deletePoll(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  togglePublish(id: string, publish: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/toggle-publish?publish=${publish}`, {});
  }

  closePoll(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/close`, {});
  }

  castVote(pollId: string, optionId: string): Observable<any> {
    return this.http.post(`${this.votesUrl}/${pollId}`, { pollOptionId: optionId });
  }
}
