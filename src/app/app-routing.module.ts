import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewTaskComponent } from './view-task/view-task.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddProjectComponent } from './add-project/add-project.component';


const routes: Routes = [
  { path: '', redirectTo: 'addUser', pathMatch: 'full' },
  { path: 'tasks', component: ViewTaskComponent },
  { path: 'addTask', component: AddTaskComponent },
  { path: 'editTask/:id/:isParentUpdate', component: AddTaskComponent },
  { path: 'addUser', component:  AddUserComponent},
  { path: 'addProject', component:  AddProjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
