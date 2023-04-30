import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventsService } from 'src/app/services/events.service';
import { RecipesService } from 'src/app/services/recipes.service';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  events: any[] = [];
  favs: any[] = [];
  userId!: number;
  calendarOptions: CalendarOptions;
  calendarEvents: any[] = [];
  selectedLabel: string = '';
  paginaCorrente: number = 1;


  constructor(private recipesSrv: RecipesService, private usersSrv: UsersService, private eventsSrv: EventsService) {
    this.calendarOptions = {
      plugins: [dayGridPlugin],
      initialView: 'dayGridWeek', //dayGridMonth
      events: this.calendarEvents,
      eventClick: this.deleteEvent.bind(this)
    };
  }

  ngOnInit(): void {
    this.getUser();
  }

  // Per recuperare l'utente loggato tramite user id (e tutti gli eventi/preferiti)
  getUser() {
    const user = window.localStorage.getItem('token');
    const parseUser = JSON.parse(user!);

    this.usersSrv.getUserByUserId(parseUser.user.uid).subscribe(res => {
      this.userId = res;

      this.getEvents(res);
      this.getIdFavs(parseUser.user.uid);
    })
  }

  // Per recuperare la lista degli eventi dell'utente loggato
  getEvents(userId: string) {
    this.eventsSrv.getEvents(userId).subscribe(res => {
      this.calendarEvents = res;
    });
  }

  // Per recuperare tutti gli id dei preferiti dell'utente loggato
  getIdFavs(userId: string) {
    this.usersSrv.getFavsByUserId(userId).subscribe(res => {
      this.getFavRecipes(res);
    });
  }

  // Per recuperare tutti i dati delle ricette in base agli id dell'array favs
  getFavRecipes(favs: string[]) {
    if (this.favs !== null) {
      favs.forEach((recipeId) => {
        this.recipesSrv.getRecipeById(recipeId).subscribe((recipeData) => {
          this.favs.push(recipeData.recipe);
        });
      });
    }
  }

  // Per aggiungere un evento...
  addEvent(form: NgForm, title: string) {
    this.updateUserEvents(this.userId, form, title);
  }

  // ...e aggiornando i suoi dati (in questo caso gli eventi)
  updateUserEvents(id: number, form: NgForm, title: string) {
    const user = window.localStorage.getItem('token');
    const parseUser = JSON.parse(user!);

    let newEvent = {
      title: title,
      date: form.value.date
    }

    this.eventsSrv.addEvent(newEvent, id).subscribe(res => {
      this.events.push(res);

      this.usersSrv.getUserByUserId(parseUser.user.uid).subscribe(res => {
        this.getEvents(res);
      })
    })
  }

  // Per eliminare un evento al click sul calendario
  deleteEvent(arg: EventClickArg) {
    const user = window.localStorage.getItem('token');
    const parseUser = JSON.parse(user!);

    Swal.fire({
      title: 'Do you want to remove the recipe?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#A5A6A0',
      confirmButtonColor: '#345834',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersSrv.getUserByUserId(parseUser.user.uid).subscribe(res => {
          this.eventsSrv.deleteEvent(parseInt(arg.event._def.publicId), res).subscribe(response => {
            arg.event.remove();
          })
        })
        Swal.fire(
          'Deleted!',
          'Recipe has been deleted.',
          'success'
        )
      } else {
        return;
      }
    })
  }

}
