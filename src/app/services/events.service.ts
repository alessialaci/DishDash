import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient) { }

  // Per recuperare tutti gli eventi da mockAPI
  getEvents(userId: string) {
    const url = `https://64493726b88a78a8f001273f.mockapi.io/api/v1/users/${userId}/events`;
    return this.http.get<any[]>(url);
  }

  // Per aggiungere un evento nel mockAPI
  addEvent(event: any, userId: number) {
    const url = `https://64493726b88a78a8f001273f.mockapi.io/api/v1/users/${userId}/events`;
    return this.http.post(url, event);
  }

  // Per eliminare un evento dal mockAPI
  deleteEvent(eventId: number, userId: number) {
    const url = `https://64493726b88a78a8f001273f.mockapi.io/api/v1/users/${userId}/events/${eventId}`;
    return this.http.delete(url);
  }

}
