import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { SurveyEditorComponent } from './components/surveyeditor/survey.editor.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PasswordComponent } from './components/password/password.component';
import { FiltrodashComponent } from './components/dashboard/filtrodash.component';
import { GraficoPreguntaComponent } from './components/dashboard/graficoPregunta.component';
import { misEncuestasComponent } from './components/misencuestas/misencuestas.component';
import { respuestaComponent } from './components/respuesta/respuesta.component';
import { RegisterComponent } from './components/register/register.component';
import { ConfirmationComponent } from './components/register/confirmation.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { CategoriaFormComponent } from './components/categorias/categoria-form.component';
import { VistapreviaComponent } from './components/vistaprevia/vistaprevia.component';
import { misUsuariosComponent } from './components/misusuarios/misusuarios.component';
import { MispreguntascustomComponent } from './components/mispreguntascustom/mispreguntascustom.component';
import { AuthGuard } from './components/guards';
import { ShareSurveyComponent } from './components/share-survey/share-survey.component';


@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
            {path: 'surveyeditor', component: SurveyEditorComponent, canActivate: [AuthGuard]},
            {path: 'login', component: LoginComponent},
            {path: 'user', component: UserComponent, canActivate: [AuthGuard]},
            {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
            {path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthGuard]},
            {path: 'password', component: PasswordComponent, canActivate: [AuthGuard]},
            {path: 'misencuestas', component: misEncuestasComponent, canActivate: [AuthGuard]},
            {path: 'mispreguntascustom', component: MispreguntascustomComponent, canActivate: [AuthGuard]},
            {path: 'register', component: RegisterComponent},
            {path: 'confirmation/:token', component: ConfirmationComponent},
            {path: 'misusuarios', component: misUsuariosComponent, canActivate: [AuthGuard]},
            {path: 'editor/:id', component: SurveyEditorComponent, canActivate: [AuthGuard]},
            {path: 'respuesta/:id', component: respuestaComponent},
            {path: 'respuesta/:id', component: respuestaComponent},
            {path: 'categorias', component: CategoriasComponent},
            {path: 'categoria/:id', component: CategoriaFormComponent},
            {path: 'vistaprevia/:id', component: VistapreviaComponent, canActivate: [AuthGuard]},
            {path: 'sharesurvey/:id', component: ShareSurveyComponent, canActivate: [AuthGuard]},
            { path:'', pathMatch:'full', redirectTo:'home'},
            { path:'**', pathMatch:'full', redirectTo:'home'}
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
