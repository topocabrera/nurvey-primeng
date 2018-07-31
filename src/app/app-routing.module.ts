import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { SurveyEditorComponent } from './components/surveyeditor/survey.editor.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PasswordComponent } from './components/password/password.component';
import { AuthGuard } from './components/guards/index';
import { FiltrodashComponent } from './components/dashboard/filtrodash.component';
import { GraficoPreguntaComponent } from './components/dashboard/graficoPregunta.component';
import { misEncuestasComponent } from './components/misencuestas/misencuestas.component';
import { respuestaComponent } from './components/respuesta/respuesta.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
            //{path: 'setup', loadChildren: './components/setup/setup.module#SetupModule'},
            {path: 'surveyeditor', component: SurveyEditorComponent},
            {path: 'login', component: LoginComponent},
            {path: 'user', component: UserComponent},
            {path: 'dashboard', component: DashboardComponent},
            {path: 'dashboard/:id', component: DashboardComponent},
            {path: 'password', component: PasswordComponent},
            {path: 'misencuestas', component: misEncuestasComponent},
            {path: 'register', component: RegisterComponent},
            {path: 'editor/:id', component: SurveyEditorComponent},
            {path: 'respuesta/:id', component: respuestaComponent}
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
