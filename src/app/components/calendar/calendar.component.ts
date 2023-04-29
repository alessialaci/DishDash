import { Component, OnInit, ViewChild } from '@angular/core';
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
  favs = [];
  displayedRecipes: any[] = [];
  calendarOptions: CalendarOptions;
  calendarEvents: any[] = [];
  selectedLabel: string = '';
  @ViewChild('modal') modal: any;

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
    this.getIdFavs(parseUser.user.uid)
  }

  // Per recuperare la lista degli eventi dell'utente loggato
  getEvents(userId: string) {
    this.recipeSrv.getEventsByUserId(userId).subscribe(res => {
      this.calendarEvents = res;
    });
  }

  // Per recuperare la lista dei preferiti dell'utente loggato
  getIdFavs(userId: string) {
    this.recipeSrv.getFavsByUserId(userId).subscribe(res => {
      console.log(res);

      this.favs = res;
      this.getFavRecipes(res)
    });
  }

  getFavs(favs: any) {
    for(let i = 0; i < favs.length; i++) {
      this.recipeSrv.getRecipeById(favs[0]).subscribe(res => {
        this.favs = res
      })
    }
  }


  // metodo per recuperare i dati delle ricette in base agli id nell'array favs
  getFavRecipes(favs: string[]) {
    if (this.favs !== null) {
      favs.forEach((recipeId) => {
        this.recipeSrv.getRecipeById(recipeId).subscribe((recipeData) => {
          this.displayedRecipes.push(recipeData.recipe);
        });
      });
    }
  }

  handleEventClick(arg: EventClickArg) {
    console.log('ciao');
    console.log('Event:', arg.event);

    let ok = confirm('Do you want to remove the recipe?');

    const titleId = arg.event._def.title;

    if(ok) {
      arg.event.remove();
      this.recipeSrv.deleteEvent(titleId).subscribe(response => {
          console.log('Event removed successfully:', response);
          arg.event.remove();
        })
    } else {
      return;
    }

  }

  handleDateClick(arg: any) {
    console.log('date click! ' + arg.dateStr);
  }

  // Per aggiungere una ricetta (event) al calendario...
  addEvent(form: NgForm, title: string) {
    this.getUser(form, title)
  }

  // ...recuperando lo user tramite userId...
  getUser(form: NgForm, title: string) {
    const user = window.localStorage.getItem('token');
    const parseUser = JSON.parse(user!);

    this.recipeSrv.getUserByUserId(parseUser.user.uid).subscribe(res => {
      this.updateUserEvents(res, form, parseUser.user.uid, title);
    })
  }

  // ...e aggiornando i suoi dati (in questo caso gli eventi)
  updateUserEvents(id: number, form: NgForm, userId: string, title: string) {
    const user = window.localStorage.getItem('token');
    const parseUser = JSON.parse(user!);

    this.recipeSrv.getEventsByUserId(parseUser.user.uid).subscribe(res => {
      this.events = res;

      let newEvent = {
      title: title,
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
    })
  }

}
