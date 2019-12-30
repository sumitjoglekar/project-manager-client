import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Project } from '../model/project';
import { ProjectsService } from '../projects.service';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  projectForm: FormGroup;
  projects: Observable<Project[]>;
  filteredProjects: Observable<Project[]>;
  project: Project = new Project();
  submitted = false;
  submitButtonText = 'Add';
  error:any={isError:false,errorMessage:''};
  disableInputs: boolean = false;
  todaysDate: Date;
  tomorrowsDate: Date;

  private _searchProject: string;
  get searchProject(): string {
    return this._searchProject;
  }

  set searchProject(value: string) {
    this._searchProject = value;
    this.filteredProjects = this.filterProjects(value);
  }

  constructor(private projectService: ProjectsService, private router: Router, 
    private formBuilder: FormBuilder) {
      this.todaysDate = new Date();
      this.tomorrowsDate = new Date(this.todaysDate.setDate(this.todaysDate.getDate() + 1));
  }

  ngOnInit() {
    this.createForm();
    this.loadProjects();
  }

  loadProjects() {
    this.projects = this.projectService.getProjects();
    this.filteredProjects = this.projects;
    this.submitButtonText = 'Add';
  }

  compareTwoDates() {
    if(new Date(this.projectForm.controls['endDate'].value)<new Date(this.projectForm.controls['startDate'].value)){
      this.error={isError:true,errorMessage:"End Date can't before start date"};
   }
  }

  createForm() {
    this.projectForm = this.formBuilder.group({
      projectId:[''],
      project: ['', Validators.required],
      isSetDates:[''],
      startDate: [formatDate(this.todaysDate, 'mm/dd/yyyy', 'en'), Validators.required],
      endDate: [formatDate(this.tomorrowsDate, 'mm/dd/yyyy', 'en'), Validators.required],
      priority: ['', Validators.required]
    });
  }

  filterProjects(searchString: string): Observable<Project[]> {
    return this.projects.pipe(map((projects: Project[]) => projects.filter(
        project => (project.project.toLowerCase().indexOf(searchString.toLowerCase()) !== -1) 
      )));
  }

  newProject(): void {
    this.submitted = false;
    this.project = new Project();
  }

  getStartAndEndDates(project: any) {
    project.startDate = formatDate(this.todaysDate, 'yyyy-MM-dd', 'en');
    project.endDate = formatDate(this.tomorrowsDate, 'yyyy-MM-dd', 'en');
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.projectForm.invalid) {      
      this.project = this.projectForm.value;
      this.project.users=[];
      if(this.projectForm.value['isSetDates']) {
        this.getStartAndEndDates(this.project);
      }
      
      if(!this.project.projectId) {
        this.projectService.createProject(this.project)
        .subscribe(data => {
            this.loadProjects();
          },
          errors=> console.log(errors));
      } else {
        this.projectService.updateProject(this.project.projectId, this.project)
        .subscribe(data => {
          this.loadProjects();
        },
        errors=> console.log(errors));
      }
      this.submitted = false;
    }
    this.projectForm.reset();
  }

  updateProject(id: number): void {
    this.projectService.getProject(id).subscribe(
      data=> {
        this.submitButtonText = 'Update';
        this.projectForm.patchValue({
          projectId: data.projectId,
          project: data.project,
          startDate: data.startDate,
          endDate: data.endDate,
          priority: data.priority
        });
      }
    ); 
  }

  onCheckboxClick() {
    this.projectForm.controls['isSetDates'].valueChanges.subscribe(value => {
      if(value) {
        this.projectForm.get('startDate').disable();
        this.projectForm.get('endDate').disable();
      } else {
        this.projectForm.get('startDate').enable();
        this.projectForm.get('endDate').enable();
      }
    });
  }

  resetForm() {
    this.error={};
    this.createForm();
  }

  deleteProject(): void {
  }

}
