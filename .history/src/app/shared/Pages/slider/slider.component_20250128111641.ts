import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PermissionGetAllDTO } from '../../Models/Authentication/PermissionDTO';
import { User } from '../../Models/Authentication/User';
import { CookiesStorgeService } from '../../Services/Storage/cookies-storge.service';
import { JwtDecodeService } from '../../Services/Authentication/jwt-decode.service';
import { PermissionsService } from '../../Services/Authentication/permissions.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements OnInit {
  user!: User;
  PermissionDTOList: PermissionGetAllDTO[] = [];
  menuItems = [
    {
      name: 'Starter Pages',
      icon: 'fas fa-tachometer-alt',
      expanded: false,
      children: [
        {
          name: 'Main',
          icon: 'fas fa-home',
          link: '/Admin/Main',
        },
        {
          name: 'Patient',
          icon: 'fas fa-procedures',
          link: '/Admin/Patient',
        },
      ],
    },
    {
      name: 'Administration',
      icon: 'fas fa-cogs',
      expanded: false,
      children: [
        {
          name: 'Setting',
          icon: 'fas fa-cogs',
          link: '/Admin/Setting',
        },
        {
          name: 'Calendar',
          icon: 'fas fa-calendar-alt',
          link: '/Admin/Calendar',
        },
      ],
    },
  ];

  constructor(
    private cookiesStorgeService: CookiesStorgeService,
    private _PermissionsService: PermissionsService,
    public _jwtDecodeService: JwtDecodeService,
    private router: Router
  ) {
    // Listen to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveMenu();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.PermissionDTOList =
      (await this._PermissionsService.getToken())?.Permissions ?? [];
    await this.getCurrentUser();
    this.setActiveMenu();
  }

  async getCurrentUser() {
    this.user = await JSON.parse(
      this.cookiesStorgeService.getCookie('US_') || ''
    );
  }

  logOut() {
    localStorage.clear();
    this.cookiesStorgeService.clearCookies();
  }

  filteredItems(searchText: string): boolean {
    const list = this.PermissionDTOList.filter((item) =>
      item.FrontendPart.toLowerCase().includes(searchText.toLowerCase())
    );
    return list.length > 0;
  }

  toggleMenu(item: any) {
    // Collapse all other items
    this.menuItems.forEach((i) => {
      if (i !== item) i.expanded = false;
    });

    // Toggle the clicked item
    item.expanded = !item.expanded;
  }

  setActiveMenu() {
    this.menuItems.forEach((item) => {
      item.expanded = item.children.some((subItem) =>
        this.router.url.includes(subItem?.link ?? '')
      );
    });
  }
}
