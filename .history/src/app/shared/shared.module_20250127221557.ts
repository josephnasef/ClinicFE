import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CookieService } from 'ngx-cookie-service';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { PanelMenu, PanelMenuModule } from 'primeng/panelmenu';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TokenInterceptor } from './Interceptors/token.interceptor';
import { HeaderComponent } from './Pages/header/header.component';
import { ModalContentsComponent } from './Pages/modal-contents/modal-contents.component';
import { ModelDialogComponent } from './Pages/model-dialog/model-dialog.component';
import { SliderComponent } from './Pages/slider/slider.component';
import { LoadingSpinnerComponent } from './Pages/Spinner/loading-spinner/loading-spinner.component';
import { TooltipComponent } from './Pages/tooltip/tooltip.component';
import { FilterPipe } from './Pipes/filter.pipe';
import { SortByPipe } from './Pipes/OrderByPipe';
import { SafePipe } from './Pipes/SafePipe';
import { AccountsService } from './Services/Authentication/Accounts.service';
import { AuthService } from './Services/Authentication/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';

const components = [
  ModelDialogComponent,
  LoadingSpinnerComponent,
  SafePipe,
  SortByPipe,
  ModelDialogComponent,
  ModalContentsComponent,
  HeaderComponent,
  SliderComponent,
  TooltipComponent,
  FilterPipe
];
const Modeules = [
  FileUploadModule,
  MatSelectModule,
  MatOptionModule, // Include MatOptionModule here
  MatTableModule,
  MatToolbarModule,
  InputSwitchModule,
  TabViewModule,
  TableModule,
  DropdownModule,
  ButtonModule,
  InputTextModule,
  MultiSelectModule,
  ListboxModule,
  SplitButtonModule,
  MatButtonModule,
  MatMenuModule,
  MenuModule,
  FormsModule,
  CommonModule,
  ReactiveFormsModule,
  NgxSpinnerModule,
  ProgressBarModule,
  ConfirmDialogModule,
  NgSelectModule,
  TableModule,
  CalendarModule,
  SliderModule,
  DialogModule,
  MultiSelectModule,
  ContextMenuModule,
  DropdownModule,
  ButtonModule,
  ToastModule,
  InputTextModule,
  ToolbarModule,
  PanelMenuModule,
  PaginatorModule,
  CheckboxModule,
  CardModule,
  TabsModule,
  PanelMenu,
  ToggleSwitchModule,
  MatFormFieldModule,
  MatInputModule,
  FormsModule,
  MatButtonModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatCheckboxModule,
  MatListModule,
  MatIconModule,
  MatDividerModule,
  MatCardModule,
  MatDialogModule,
  MatButtonModule,
  MatNativeDateModule,
  SelectDropDownModule,
  FormsModule,
  ListboxModule,
  MatTooltipModule
];

@NgModule({
  declarations: components,
  providers: [
    CookieService,
    AuthService,
    AccountsService,
  ],

  imports: [
    TranslateModule,
    RouterModule,
    Modeules,
    // BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],

  exports: [TooltipModule, PortalModule, components, Modeules],
})
export class SharedModule {
  constructor() { }
  public static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SharedModule,
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      ],
    };
  }
}
