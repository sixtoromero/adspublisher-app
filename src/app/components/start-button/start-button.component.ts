import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-start-button',
  templateUrl: './start-button.component.html',
  styleUrls: ['./start-button.component.scss']
})
export class StartButtonComponent implements OnInit {
  constructor(private router: Router,
              private gservice: GeneralService) {}

  async ngOnInit() {
    const IsSlide = await this.gservice.getStorage('IsSlide');
    if (IsSlide) {
      this.router.navigate(['/login']);
    }
  }

  async navigateToLogin() {
    await this.gservice.setStorage('IsSlide', true);
    this.router.navigate(['/login']);
  }
}
