import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { endOfDay, isSameDay, isSameMonth, startOfDay, toDate } from 'date-fns';
import * as EventEmitter from 'events';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';
import { BookingState } from 'src/app/shared/Enums/BookingState.enum';
import { PermissionGetAllDTO } from 'src/app/shared/Models/Authentication/PermissionDTO';
import { EmployeeDTO } from 'src/app/shared/Models/Employees/EmployeeDTO';
import { AccountsService } from 'src/app/shared/Services/Authentication/Accounts.service';
import { PermissionsService } from 'src/app/shared/Services/Authentication/permissions.service';
import { AppointmentDialogComponent } from '../../Dialogs/AppointmentDialog/AppointmentDialog.component';
import { Booking } from '../../Models/booking';
import { AppointmentService } from '../../Services/appointment.service';
import { EventDialogComponent } from './EventDialogComponent/EventDialogComponent.component';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  Gray: {
    primary: '#7D9D9C',
    secondary: '#E4DCCF',
  },
  Green: {
    primary: '#367E18',
    secondary: '#FFE9A0',
  },
};

@Component({
  selector: 'app-Calendar',
  templateUrl: './Calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, // Using OnPush strategy
  styles: [
    `
      .scroll-container {
        height: calc(100vh - 430px);
        overflow-y: auto;
      }

      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }
    `,
  ],
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent:
    | TemplateRef<any>
    | undefined;
  services$: EmployeeDTO[] = [];
  view: CalendarView = CalendarView.Month;
  MyCustomerId: any;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  bookingList: Booking[] = [];
  users: any[] = [];

  PermissionDTOList: PermissionGetAllDTO[] | null = [];

  constructor(
    public router: Router,
    private modal: NgbModal,
    private _Services: AccountsService,
    private appointmentService: AppointmentService,
    private spinnerService: NgxSpinnerService,
    private _PermissionsService: PermissionsService,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef for manual change detection
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  filteredItems(searchText: string): boolean {
    const list = this.PermissionDTOList?.filter((item) =>
      item.FrontendPart.toLowerCase().includes(searchText.toLowerCase())
    );
    return list && list.length > 0 ? list.length > 0 : false;
  }
  AppConstants = AppConstants;
  async ngOnInit() {
    this.spinnerService.show();
    this.GetAllEmployee();
    this.getAllBookingHistoryWithoutId();
    this.PermissionDTOList =
      (await this._PermissionsService.getToken())?.Permissions ?? [];
  }

  modalData:
    | {
      action: string;
      event: CalendarEvent;
    }
    | undefined;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  changeEmployee($event: any) {
    if ($event == undefined) {
      this.getAllBookingHistoryWithoutId();
    } else {
      this.MyCustomerId = $event.id;
      this.getAllData(this.MyCustomerId);
    }
  }

  unSubscrbe!: Subscription;

  GetAllEmployee() {
    this.unSubscrbe = this._Services.GetAllEmployee().subscribe((res) => {
      if (res.data) {
        this.services$ = res.data;
      } else {
        console.error('Data is undefined');
      }
    });
  }

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '500px', // Adjust as needed
      data: { event, action }, // Pass event and action data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed:', result);
      // Handle the result if needed
    });
  }

  @Output() updateMiddleComponent = new EventEmitter();

  GoToPaientProfile(Id: any, any: any) {
    this.updateMiddleComponent.emit(any);
    if (Id) {
      this.router.navigateByUrl('/Admin/Patient/Profile/' + Id);
    }
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];

    // After adding events, trigger change detection manually
    this.cdr.detectChanges();
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  getAllBookingHistoryWithoutId() {
    this.appointmentService.getAllBookingHistoryWithoutId().subscribe({
      next: (book: any) => {
        this.bookingList = book?.data;
        if (this.bookingList) {
          for (let index = 0; index < this.bookingList.length; index++) {
            const element = this.bookingList[index];
            if (element?.employee?.userName) {
              if (this.users.filter((s) => s === element.employee.userName).length === 0) {
                this.users.push(element.employee.userName);
              }
            }
          }
        }
        this.spinnerService.hide();
        this.fillCalendar(this.bookingList);
        // this.toastr.success('Booking history loaded successfully!');
      },
      error: (err: any) => {
        console.error('Error fetching booking history:', err);
        this.spinnerService.hide();
        this.toastr.error('Failed to load booking history. Please try again later.');
      },
      complete: () => {
        console.log('Finished fetching booking history');
      }
    });
  }

  getAllData(EmployeeId: any) {
    this.appointmentService
      .AllBookingHistoryByEmployeeId(EmployeeId)
      .subscribe((book: any) => {
        next: {
          this.bookingList = book?.data;
        }
        if (this.bookingList) {
          for (let index = 0; index < this.bookingList.length; index++) {
            const element = this.bookingList[index];
            this.users.push(element.employee.userName);
          }
        }
        this.spinnerService.hide();
        this.fillCalendar(this.bookingList);
      });
  }

  addEventCust(re: any): void {
    var startArr = re.from.split(':');
    var EndArr = re.to.split(':');
    var AppointmentDate = new Date(re.appointmentDate);
    var start = AppointmentDate.setHours(
      parseInt(startArr[0]),
      parseInt(startArr[1]),
      parseInt(startArr[2])
    );
    var End = AppointmentDate.setHours(
      parseInt(EndArr[0]),
      parseInt(EndArr[1]),
      parseInt(EndArr[2])
    );
    this.events = [
      ...this.events,
      {
        title:
          re.service?.englishName +
          ' From ' +
          re?.from +
          ' TO ' +
          re?.to +
          ' Employee Name : ' +
          re?.employee?.firstNameEn +
          re?.employee?.lastNameEn,
        start: toDate(End) > toDate(start) ? toDate(End) : toDate(start),
        end: toDate(End) < toDate(start) ? toDate(start) : toDate(End),
        color:
          re?.state === BookingState.Pending
            ? colors['yellow']
            : re?.state === BookingState.Confirmed
              ? colors['Green']
              : re?.state === BookingState.Completed
                ? colors['Gray']
                : colors['red'],
        draggable: false,
        id: re.customerId,
        resizable: {
          beforeStart: false,
          afterEnd: false,
        },
      },
    ];

    // After adding events, trigger change detection manually
    this.cdr.detectChanges();
  }

  fillCalendar(AppointmentList: any[]) {
    if (AppointmentList) {
      this.events = [];
      if (AppointmentList.length === 0) {
        return;
      }
      for (let index = 0; index < AppointmentList.length; index++) {
        const element = AppointmentList[index];
        this.addEventCust(element);
      }
    }
  }
  @ViewChild(AppointmentDialogComponent)
  AppointmentDialogComponentChild!: AppointmentDialogComponent;
  openReservationPopup() {

    this.AppointmentDialogComponentChild.openNewAppointment();
  }



}
