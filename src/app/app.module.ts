import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

import { HomeComponent } from './components/home/home.component';
import { SurveyEditorComponent } from './components/surveyeditor/survey.editor.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';
import { SurveyService } from './services/survey.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserComponent } from './components/user/user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PasswordComponent } from './components/password/password.component';
import { FiltrodashComponent } from './components/dashboard/filtrodash.component';
import { GraficoPreguntaComponent } from './components/dashboard/graficoPregunta.component';
import { misEncuestasComponent } from './components/misencuestas/misencuestas.component';
import { respuestaComponent } from './components/respuesta/respuesta.component';
import { NavbarComponent } from './components/navbar/navbar.component'

/*Servicios */
import { AlertService, AuthenticationService, UserService } from './services';
import { PreguntasService } from './services/preguntas.service';
import { ResultadoService } from './services/resultados.service'

import { AuthGuard } from './components/guards'; 
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { LoadingComponent } from './components/loading/loading.component';
import { AlertComponent } from './components/alert/alert.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { CategoriaFormComponent } from './components/categorias/categoria-form.component';
import { VistapreviaComponent } from './components/vistaprevia/vistaprevia.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SurveyEditorComponent,
        LoginComponent,
        RegisterComponent,
        UserComponent,
        DashboardComponent,
        PasswordComponent,
        FiltrodashComponent,
        GraficoPreguntaComponent,
        misEncuestasComponent,
        respuestaComponent,
        NavbarComponent,
        LoadingComponent,
        AlertComponent,
        CategoriasComponent,
        CategoriaFormComponent,
        VistapreviaComponent,
        SidebarComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        HttpModule,
        NgIdleKeepaliveModule.forRoot(),
        ChartsModule

    ],
    providers: [SurveyService,
        PreguntasService,
        //customHttpProvider,
        AuthGuard,
        ResultadoService,
        AlertService,
        AuthenticationService,
        UserService],
    bootstrap: [AppComponent]
})
export class AppModule { }
