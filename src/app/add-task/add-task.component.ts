import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../model/task';
import { TasksService } from '../tasks.service';
import { ParentTasksService } from '../parent-tasks.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProjectsService } from '../projects.service';
import { UsersService } from '../users.service';
import { Project } from '../model/project';
import { User } from '../model/user';
import { formatDate } from '@angular/common';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  id: number;
  taskForm: FormGroup;
  projects: Observable<Project[]>;
  users: Observable<User[]>;
  parentTasks: Observable<Task[]>;
  task: Task = new Task();

  //button text
  submitted = false;
  submitButtonText = 'Add';

  error: any = { isError: false, errorMessage: '' };
  todaysDate: Date;
  tomorrowsDate: Date;
  closeResult: string;
  modalOptions: NgbModalOptions;

  buttonDisabled: boolean;
  isParentTaskUpdate: string;
  isEditMode: boolean = false;

  private _searchProject: string;
  get searchProject(): string {
    return this._searchProject;
  }

  set searchProject(value: string) {
    this._searchProject = value;
  }

  constructor(private taskService: TasksService,
    private parentTaskService: ParentTasksService,
    private userService: UsersService,
    private projectService: ProjectsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    }
    this.todaysDate = new Date();
    this.tomorrowsDate = new Date(this.todaysDate.setDate(this.todaysDate.getDate() + 1));
  }

  ngOnInit() {
    this.loadData();
    this.createForm();

    this.id = this.route.snapshot.params['id'];
    this.isParentTaskUpdate = this.route.snapshot.params['isParentUpdate'];
    if (this.isParentTaskUpdate==='true' && this.id) {
      this.updateParentTask(this.id);
    } else if (this.isParentTaskUpdate==='false' && this.id) {
      this.updateTask(this.id);
    }
  }

  loadData() {
    this.projects = this.projectService.getProjects();
    this.users = this.userService.getUsers();
    this.parentTasks = this.parentTaskService.getParentTasks();
    this.submitButtonText = 'Add';
  }

  compareTwoDates() {
    if (new Date(this.taskForm.controls['endDate'].value) < new Date(this.taskForm.controls['startDate'].value)) {
      this.error = { isError: true, errorMessage: "End Date can't before start date" };
    }
  }

  createForm() {
    this.taskForm = this.formBuilder.group({
      taskId: [''],
      task: ['', Validators.required],
      projectId: new FormControl({ value: '', disabled: true }, Validators.required),
      userId: new FormControl({ value: '', disabled: true }),
      parentTaskId: new FormControl({ value: '', disabled: true }),
      priority: new FormControl({ value: '', disabled: false }),
      isParent: new FormControl({ value: '', disabled: false }),
      startDate: [formatDate(this.todaysDate, 'mm/dd/yyyy', 'en'), Validators.required],
      endDate: [formatDate(this.tomorrowsDate, 'mm/dd/yyyy', 'en'), Validators.required]
    });
  }

  newTask(): void {
    this.submitted = false;
    this.task = new Task();
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.taskForm.invalid) {
      this.task = this.taskForm.value;
      this.task.projectId = this.taskForm.get('projectId').value;
      this.task.parentTaskId = this.taskForm.get('parentTaskId').value;
      this.task.userIds = [];

      console.log('before saveupdate', this.task);
      if(this.task.isParent) {
        this.saveUpdateParentTask(this.task);
      } else {
        this.saveUpdateTask(this.task);
      }
      this.submitted = false;
    }
    this.taskForm.reset();
  }

  saveUpdateParentTask(task: Task) {
    if (!task.taskId) {
      this.parentTaskService.createParentTask(this.task)
      .subscribe(data => {
        this.gotoList();
      },
        errors => console.log(errors));
    } else {
      this.parentTaskService.createParentTask(this.task)
      .subscribe(data => {
        this.gotoList();
      },
        errors => console.log(errors));
    }
  }

  saveUpdateTask(task: Task) {
    if (!task.taskId) {
      this.taskService.createTask(this.task)
      .subscribe(data => {
        this.gotoList();
      },
        errors => console.log(errors));
    } else {
      this.taskService.updateTask(this.task.taskId, this.task)
      .subscribe(data => {
        this.gotoList();
      },
        errors => console.log(errors));
    }
  }

  updateTask(id: number): void {
    this.taskService.getTask(id).subscribe(
      data => {
        this.submitButtonText = 'Update';
        this.isEditMode = true;
        this.disableIsParent();
        this.taskForm.patchValue({
          taskId: data.taskId,
          task: data.task,
          projectId: data.projectId,
          userId: data.userIds && data.userIds.length ? data.userIds[0] : null,
          parentTaskId: data.parentTaskId,
          priority: data.priority,
          isParent: data.isParent,
          startDate: data.startDate,
          endDate: data.endDate
        });
      }
    );
  }

  updateParentTask(id: number): void {
    this.parentTaskService.getParentTask(id).subscribe(
      data => {
        this.disableFields();
        this.submitButtonText = 'Update';
        this.taskForm.patchValue({
          taskId: data.taskId,
          task: data.task,
          projectId: data.projectId,
          userId: data.userIds && data.userIds.length ? data.userIds[0] : null,
          parentTaskId: data.parentTaskId,
          priority: data.priority,
          isParent: data.isParent,
          startDate: data.startDate,
          endDate: data.endDate
        });
      }
    );
  }

  resetForm() {
    this.error = {};
    this.createForm();
  }

  deleteTask(): void {
  }

  gotoList() {
    this.router.navigate(['/tasks']);
  }

  openModal(content: any) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  getSelectedUserId(event: any) {
    this.taskForm.get('userId').setValue(event);
  }

  getSelectedProjectId(event: any) {
    this.taskForm.get('projectId').setValue(event);
  }

  getSelectedParentId(event: any) {
    this.taskForm.get('parentTaskId').setValue(event);
  }

  onCheckboxClick() {
    this.taskForm.controls['isParent'].valueChanges.subscribe(value => {
      if (value) {
        this.disableFields();
      } else {
        this.enableFields();
      }
    });
  }

  disableFields() {
    this.taskForm.get('startDate').disable();
    this.taskForm.get('endDate').disable();
    this.buttonDisabled = true;
    this.taskForm.get('priority').disable();
  }

  enableFields() {
    this.taskForm.get('startDate').enable();
    this.taskForm.get('endDate').enable();
    this.buttonDisabled = false;
    this.taskForm.get('priority').enable();
  }

  disableIsParent() {
    this.taskForm.get('isParent').disable();
  }

  enableIsParent() {
    this.taskForm.get('isParent').enable();
  }
}
