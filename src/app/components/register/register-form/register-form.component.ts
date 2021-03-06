import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/debounceTime';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { UsersActions } from '../../../users/users.actions';
import { Person } from '../../../entities/Person';
import { UsersService } from '../../../users/users.service';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  registerForm: FormGroup;
  autocompleteTags: string[] = [];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private usersActions: UsersActions
  ) { }

  onSubmit(form) {
    if (form.valid) {
      const user = form.value as Person;
      this.usersActions.addUser(user);
    } else {
      alert('invalid form');
    }
  }

  ngOnInit() {
    this.autocompleteTags = this.usersService.getAutocompleteItems();
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      dateOfBirth: ['', Validators.required],
      area: ['', Validators.required],
      requirements: [[]], // Validation?!!?
      isAdmin: [false]
    });
  }

  addNeed(tag: string) {
    const needs = this.registerForm.value.requirements;

    const newNeeds = [...needs, tag];
    this.registerForm.controls.requirements.setValue(newNeeds);
  }

  removeNeed(tag: string) {
    const needs = this.registerForm.value.requirements;
    const index = needs.indexOf(tag);
    if (index < 0) { return; }

    const newNeeds = [...needs.slice(0, index), ...needs.slice(index + 1)];
    this.registerForm.controls.requirements.setValue(newNeeds);
  }

}
