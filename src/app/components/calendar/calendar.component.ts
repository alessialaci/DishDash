import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  calendarOptions: CalendarOptions;
  calendarEvents: any[];

  constructor() {
    this.calendarOptions = {
      plugins: [dayGridPlugin],
      initialView: 'dayGridWeek', //dayGridMonth
      events: [],
      eventClick: this.handleEventClick.bind(this)
    };

    this.calendarEvents = [
      { title: 'Evento 1', date: '2023-04-28' },
      { title: 'Evento 2', date: '2023-04-28' },
      { title: 'Evento 3', date: '2023-04-28' },
    ];
  }

  ngOnInit(): void {
  }

  handleEventClick(arg: EventClickArg) {
    console.log('ciao');
    console.log('Event:', arg.event);
  }

  handleDateClick(arg: any) {
    console.log('date click! ' + arg.dateStr);
  }

}
