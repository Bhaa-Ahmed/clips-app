import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  isAuthenticated = false;

  constructor(public modal: ModalService, public auth: AuthService) {}

  ngOnInit(): void {}

  openModal(e: Event) {
    e.preventDefault();
    this.modal.toggleModal('auth');
  }
}