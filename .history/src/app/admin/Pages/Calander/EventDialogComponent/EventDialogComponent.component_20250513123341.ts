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
  calculateDuration(start: Date, end: Date): number {
    // Ensure both start and end are valid Date objects
    if (!start || !end) {
      return 0;
    }

    const startTime = start.getTime();
    const endTime = end.getTime();

    // If the end time is before the start time, it must span into the next day
    if (endTime < startTime) {
      return (endTime + 24 * 60 * 60 * 1000 - startTime) / (1000 * 60 * 60);
    }

    // Otherwise, just calculate the difference in hours
    return (endTime - startTime) / (1000 * 60 * 60);
  }

}
