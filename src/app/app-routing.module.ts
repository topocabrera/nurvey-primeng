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
import { CategoriasComponent } from './components/categorias/categorias.component';
import { CategoriaFormComponent } from './components/categorias/categoria-form.component';
import { VistapreviaComponent } from './components/vistaprevia/vistaprevia.component';

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
            {path: 'respuesta/:id', component: respuestaComponent},
            {path: 'categorias', component: CategoriasComponent},
            {path: 'categoria/:id', component: CategoriaFormComponent},
            {path: 'vistaprevia/:id', component: VistapreviaComponent},
            { path:'', pathMatch:'full', redirectTo:'home'},
            { path:'**', pathMatch:'full', redirectTo:'home'}
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
