import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../model/task';
import { TasksService } from '../tasks.service';
import { ParentTasksService } from '../parent-tasks.service';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { ProjectsService } from '../projects.service';
import { Project } from '../model/project';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  tasks: Observable<Task[]>;
  taskToEnd: Task;
  parentTasks: Observable<Task[]>;
  projects: Observable<Project[]>;
  searchProjectId: number;
  selectedParent: number;
  closeResult: string;
  modalOptions:NgbModalOptions;

  private _selectedProjectId: number;
  get selectedProjectId(): number {
    return this._selectedProjectId;
  }

  set selectedProjectId(value: number) {
    this._selectedProjectId = value;
    this.searchProjectId = value;
    this.tasks = this.taskService.getTasksByProject(value.toString());
  }

  constructor(private taskService: TasksService, 
    private parentTasksService: ParentTasksService,
    private projectsService: ProjectsService,
    private router: Router,
    private modalService: NgbModal) {
      this.modalOptions = {
        backdrop:'static',
        backdropClass:'customBackdrop'
      }
    }

  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    this.projects = this.projectsService.getProjects();
    this.parentTasks = this.parentTasksService.getParentTasks();
  }

  updateTask(id: number, isParentUpdate: boolean){
    this.router.navigate(['/editTask', id, isParentUpdate]);
  }

  endTask(id: number) {
    this.tasks.subscribe( tasks => {
      this.taskToEnd = tasks.find(task => task.taskId === id);
      this.taskToEnd.isFinished = true;

      this.taskService.updateTask(id, this.taskToEnd)
      .subscribe(data => {
        this.reloadData();
      }, error => console.log(error));
    });  
  }

  getSelectedParent(): number {
    return this.selectedParent;
  }

  openModal(content: any) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
}
