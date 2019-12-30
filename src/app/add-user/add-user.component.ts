import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Project } from '../model/project';
import { Task } from '../model/task';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  users: Observable<User[]>;
  filteredUsers: Observable<User[]>;
  user: User = new User();
  submitted = false;
  submitButtonText = 'Add';

  private _searchUser: string;
  get searchUser(): string {
    return this._searchUser;
  }

  set searchUser(value: string) {
    this._searchUser = value;
    this.filteredUsers = this.filterUsers(value);
  }

  constructor(private userService: UsersService, private router: Router, 
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
    this.loadUsers();
  }

  loadUsers() {
    this.users = this.userService.getUsers();
    this.filteredUsers = this.users;
    this.submitButtonText = 'Add';
  }

  createForm() {
    this.userForm = this.formBuilder.group({
      userId:[''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      employeeId: ['', Validators.required],
      projectId: ['', Validators.required],
      taskId: ['', Validators.required],
    });
  }

  filterUsers(searchString: string): Observable<User[]> {
    return this.users.pipe(map((users: User[]) => users.filter(
        user => (user.firstName.toLowerCase().indexOf(searchString.toLowerCase()) !== -1) || 
        (user.lastName.toLowerCase().indexOf(searchString.toLowerCase()) !== -1)
      )));
  }

  newUser(): void {
    this.submitted = false;
    this.user = new User();
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.userForm.invalid) {      
      this.user = this.userForm.value;
      if(!this.user.userId) {
        this.userService.createUser(this.user)
        .subscribe(data => {
            this.loadUsers();
          },
          errors=> console.log(errors));
      } else {
        this.userService.updateUser(this.user.userId, this.user)
        .subscribe(data => {
          this.loadUsers();
        },
        errors=> console.log(errors));
      }
      this.submitted = false;
    }
    this.userForm.reset();
  }

  updateUser(id: number): void {
    this.userService.getUser(id).subscribe(
      data=> {
        this.submitButtonText = 'Update';
        this.userForm.patchValue({
          userId: data.userId,
          firstName: data.firstName, 
          lastName: data.lastName,
          employeeId: data.employeeId,
          projectId: data.projectId,
          taskId: data.taskId
        });
      }
    ); 
  }

  resetForm() {
    this.createForm();
  }

  deleteUser(): void {
  }
}
