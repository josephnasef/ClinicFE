import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConstants } from 'src/app/app.constants';
import { PermissionGetAllDTO } from 'src/app/shared/Models/Authentication/PermissionDTO';
import { ShiftDTO } from 'src/app/shared/Models/Employees/EmployeeShiftDTO';
import { ShiftDetailsDialogComponent } from '../ShiftDetailsDialog/ShiftDetailsDialog.component';

@Component({
  selector: 'app-shift-list',
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.css']
})
export class ShiftListComponent implements OnChanges {
  @Input() shifts: ShiftDTO[] = [];
  paginatedShifts: ShiftDTO[] = [];
  totalRecords!: number;
  rows: number = 3;
  PermissionDTOList: PermissionGetAllDTO[] = [];
  AppConstants = AppConstants;

  constructor(private dialog: MatDialog) {

  }

  ngOnChanges(changes: SimpleChanges): void {
  if (changes['shifts']) {
    this.allShifts = [...this.shifts]; // Store original for filtering
    this.totalRecords = this.allShifts.length;
    this.loadShifts({ first: 0, rows: this.rows });
  }
}
  filteredItems(searchText: string): boolean {
    const list = this.PermissionDTOList.filter((item) =>
      item.FrontendPart.toLowerCase().includes(searchText.toLowerCase())
    );
    return list.length > 0;
  }
  loadShifts(event: any): void {
    this.paginatedShifts = this.shifts.slice(event.first, event.first + event.rows);
  }
  openShiftDetails(shiftId: number): void {
    this.dialog.open(ShiftDetailsDialogComponent, {
      width: '60%',
      data: { id: shiftId }
    });
  }
  fromDate: Date | null = null;
  toDate: Date | null = null;
  allShifts: ShiftDTO[] = [];       // Original unfiltered data

filterByDateRange() {
  if (this.fromDate && this.toDate) {
    const from = new Date(this.fromDate).setHours(0, 0, 0, 0);
    const to = new Date(this.toDate).setHours(23, 59, 59, 999);

    const filtered = this.allShifts.filter(shift => {
      const day = new Date(shift.dayDate).getTime();
      return day >= from && day <= to;
    });

    this.totalRecords = filtered.length;
    this.paginatedShifts = filtered.slice(0, this.rows);
  }
}


  resetFilter() {
    this.fromDate = null;
    this.toDate = null;
    this.paginatedShifts = [...this.allShifts];
  }
}
