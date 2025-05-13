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
  dateRange: Date[] | null = null;  // This will hold both start and end date


  allShifts: ShiftDTO[] = [];  // store original unfiltered data
  constructor(private dialog: MatDialog) {

  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shifts']) {
      this.allShifts = this.shifts;
      this.totalRecords = this.shifts.length;
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
    const filtered = this.filterShifts();
    this.totalRecords = filtered.length;
    this.paginatedShifts = filtered.slice(event.first, event.first + event.rows);
  }

   filterShifts(): ShiftDTO[] {
    if (!this.dateRange || this.dateRange.length < 2) {
      return [...this.allShifts];
    }

    const from = new Date(this.dateRange[0]).setHours(0, 0, 0, 0);
    const to = new Date(this.dateRange[1]).setHours(23, 59, 59, 999);

    return this.allShifts.filter(shift => {
      const date = new Date(shift.dayDate).getTime();
      return date >= from && date <= to;
    });
  }

  openShiftDetails(shiftId: number): void {
    this.dialog.open(ShiftDetailsDialogComponent, {
      width: '60%',
      data: { id: shiftId }
    });
  }

   filterByDateRange(): void {
    this.loadShifts({ first: 0, rows: this.rows });
  }

  resetFilter(): void {
    this.dateRange = null;
    this.loadShifts({ first: 0, rows: this.rows });
  }

}
