import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShiftDTO } from 'src/app/shared/Models/Employees/EmployeeShiftDTO';
import { ShiftDetailsDialogComponent } from '../ShiftDetailsDialog/ShiftDetailsDialog.component';
import { PermissionGetAllDTO } from 'src/app/shared/Models/Authentication/PermissionDTO';
import { AppConstants } from 'src/app/app.constants';

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
    if (changes['shifts']) {  // Use bracket notation here
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
    this.paginatedShifts = this.shifts.slice(event.first, event.first + event.rows);
  }
  openShiftDetails(shiftId: number): void {
    this.dialog.open(ShiftDetailsDialogComponent, {
      width: '60%',
      data: { id: shiftId }
    });
  }
}
