import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from 'src/app/admin/Services/patient.service';
import { Gender } from 'src/app/shared/Enums/Gender.enum';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.css'],
})
export class PatientDialogComponent implements OnInit {
  constructor(
    private fb: UntypedFormBuilder,
    private patientService: PatientService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initPatientForm();
  }
  PatientForm!: UntypedFormGroup;
  IsValid: boolean = true;
  PatientDialog: boolean = false;
  gender = Gender;

  hideDialog() {
    this.PatientDialog = false;
  }
  CollectAge(event: any) {
    const dd = new Date(event.target.value);
    this.PatientForm.controls['age'].setValue(this.CalculateAge(dd));
  }
  CalculateAge(birthdate: Date) {
    if (birthdate) {
      var timeDiff = Math.abs(
        new Date().getUTCFullYear() - birthdate.getUTCFullYear()
      );
      return timeDiff;
    } else {
      return 0;
    }
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  initPatientForm() {
    this.PatientForm = this.fb.group({
      Id: new UntypedFormControl(0),
      Name: new UntypedFormControl('', [Validators.required]),
      age: new UntypedFormControl(5),
      address: new UntypedFormControl('', [Validators.required]),
      phoneNumber: new UntypedFormControl('', [Validators.required]),
      nationalId: new UntypedFormControl(),
      gender: new UntypedFormControl('', [Validators.required]),
      BirthDate: new UntypedFormControl('', [Validators.required]),
      wight: new UntypedFormControl('', [Validators.required]),
      height: new UntypedFormControl('', [Validators.required]),
      isDeleted: new UntypedFormControl(false, [Validators.required]),
      passportnumber: new UntypedFormControl('', [Validators.required]),
      MaritaStatus: new UntypedFormControl('Single', [Validators.required]),
    });
  }
  @Output() updateEvent = new EventEmitter<string>();

  updateParent() {
    this.updateEvent.emit('Data to update parent');
  }
  SavePatient() {
    if (this.PatientForm.valid) {
      this.patientService
        .InsertPatientDetails(this.PatientForm.value)
        .subscribe({
          next: (s) => {
            this.initPatientForm();
            this.updateParent();
            this.toastr.success('New Patient Has added', 'New Patient');
          },
          error: (error) => {
            this.toastr.success('an error has  occurred ', 'error');
          },
        });
    } else {
      this.IsValid = false;
      this.toastr.warning(
        'Please fill out the form correctly',
        'Validation Error'
      );
    }
  }
}
