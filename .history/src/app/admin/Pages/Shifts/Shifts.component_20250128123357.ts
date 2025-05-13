import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppConstants } from 'src/app/app.constants';
import { EmployeeShiftDTO, ShiftDTO } from 'src/app/shared/Models/Employees/EmployeeShiftDTO';
import { PermissionGetAllDTO } from 'src/app/shared/Models/Authentication/PermissionDTO';
import { EmployeeService } from 'src/app/admin/Services/employee.service';
import { PermissionsService } from 'src/app/shared/Services/Authentication/permissions.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-Shifts',
  templateUrl: './Shifts.component.html',
  styleUrls: ['./Shifts.component.css'],
  animations: [
    trigger('shiftAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('panelAnimation', [
      transition(':enter', [
        style({ height: '0px', opacity: 0 }),
        animate('300ms', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('300ms', style({ height: '0px', opacity: 0 }))
      ])
    ])
  ]
})
export class ShiftsComponent implements OnInit {
  PermissionDTOList: PermissionGetAllDTO[] = [];
  EmployeeShiftList?: EmployeeShiftDTO[];
  selectedEmployee?: EmployeeShiftDTO;
  EmployeeShiftListForPr: MenuItem[] = [];

  constructor(
    private employeeService: EmployeeService,
    private _PermissionsService: PermissionsService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.PermissionDTOList =
      (await this._PermissionsService.getToken())?.Permissions ?? [];
    this.GetAllEmployeesShifts();
    this.checkOpenShifts();
  }

  AppConstants = AppConstants;

  onSelect(employee: EmployeeShiftDTO): void {
    this.selectedEmployee = employee;
  }

  GetAllEmployeesShifts() {
    this.employeeService.GetAllEmployeesShifts().subscribe((s) => {
      if (s.data) {
        this.EmployeeShiftList = s.data?.length > 0 ? s.data : undefined;
        if (this.EmployeeShiftList)
          this.EmployeeShiftListForPr = this.EmployeeShiftList.map(
            (employee) => ({
              label: `${employee.employeeName} (${employee.phoneNumber})`,
              command: () => this.onSelect(employee),
            })
          );
        this.checkOpenShifts(); // Check open shifts after fetching data
        this.cdr.detectChanges(); // Manually trigger change detection
      }
    });
  }

  private timeStringToDate(dateStr: string, timeStr: string): Date {
    const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  checkOpenShifts(): void {
    const now = new Date();
    this.EmployeeShiftList?.forEach(employee => {
      employee.shifts.forEach(shift => {
        const shiftStart = this.timeStringToDate(shift.dayDate, shift.from);
        const shiftEnd = this.timeStringToDate(shift.dayDate, shift.to);

        shift.isOpen = now >= shiftStart && now <= shiftEnd; // Set isOpen based on current time
      });
    });
  }

  isShiftOpen(shift: ShiftDTO): boolean {
    return shift.isOpen ?? false; // Ensure there's a default value
  }

  filteredItems(searchText: string): boolean {
    const list = this.PermissionDTOList.filter((item) =>
      item.FrontendPart.toLowerCase().includes(searchText.toLowerCase())
    );
    return list.length > 0;
  }
}
