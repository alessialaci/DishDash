import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FavRecipe } from 'src/app/models/fav-recipe.interface';
import { User } from 'src/app/models/user.interface';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  events: any[] = [];
  favs: string[] = [];
  calendarOptions: CalendarOptions;
  calendarEvents: any[] = [];

  constructor(private recipeSrv: RecipesService) {
    this.calendarOptions = {
      plugins: [dayGridPlugin],
      initialView: 'dayGridWeek', //dayGridMonth
      events: this.calendarEvents,
      eventClick: this.handleEventClick.bind(this)
    };
  }

  ngOnInit(): void {
    const user = window.localStorage.getItem('token');
    const parseUser = JSON.parse(user!);

    this.getEvents(parseUser.user.uid);
    this.getFavs(parseUser.user.uid)
  }

  // Per recuperare la lista degli eventi dell'utente loggato
  getEvents(userId: string) {
    this.recipeSrv.getEventsByUserId(userId).subscribe(res => {
      this.calendarEvents = res;
    });
  }

  // Per recuperare la lista dei preferiti dell'utente loggato
  getFavs(userId: string) {
    this.recipeSrv.getFavsByUserId(userId).subscribe(res => {
      this.favs = res;
    });
  }

  handleEventClick(arg: EventClickArg) {
    console.log('ciao');
    console.log('Event:', arg.event);
  }

  handleDateClick(arg: any) {
    console.log('date click! ' + arg.dateStr);
  }

  // Per aggiungere una ricetta (event) al calendario...
  addEvent(form: NgForm) {
    this.getUser(form)
  }

  // ...recuperando lo user tramite userId...
  getUser(form: NgForm) {
    const user = window.localStorage.getItem('token');
    const parseUser = JSON.parse(user!);

    this.recipeSrv.getUserByUserId(parseUser.user.uid).subscribe(res => {
      this.updateUserEvents(res, form, parseUser.user.uid);
    })
  }

  // ...e aggiornando i suoi dati (in questo caso gli eventi)
  updateUserEvents(id: number, form: NgForm, userId: string) {
    let newEvent = {
      title: form.value.idRecipe,
      date: form.value.date
    }

    this.events.push(newEvent);

    let newUser: Partial<User> = {
      events: this.events
    }

    this.recipeSrv.updateRecord(id, newUser).subscribe(res => {
      console.log('ok', res);
      this.getEvents(userId);
    })
  }

}
