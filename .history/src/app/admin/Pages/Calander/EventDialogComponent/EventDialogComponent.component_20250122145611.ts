import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar/modules/calendar.module';

@Component({
  selector: 'app-EventDialogComponent',
  templateUrl: './EventDialogComponent.component.html',
  styleUrls: ['./EventDialogComponent.component.css']
})
export class EventDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: CalendarEvent; action: string }
  ) { }

  close(): void {
    this.dialogRef.close();
  }

}
