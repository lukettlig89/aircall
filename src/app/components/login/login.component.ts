import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StoreFacade } from '../../store/store.facade';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form = new FormGroup({
    username: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ]),
  });

  constructor(
    private readonly facade: StoreFacade,
  ) { }

  onLogin(): void {
    if (!this.form.valid) {
      return;
    }

    this.facade.login(this.form.getRawValue());
  }

}
