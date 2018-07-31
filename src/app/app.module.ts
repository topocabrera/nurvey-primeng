import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
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

// import { AlertComponent } from './shared/directives/index';
import { AuthGuard } from './components/guards';
import { AlertService, AuthenticationService, UserService } from './services';
import { PreguntasService } from './services/preguntas.service';
import { ResultadoService } from './services/resultados.service'

import { DataListModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { Growl } from 'primeng/growl';

import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { LoadingComponent } from './components/loading/loading.component';
import { AlertComponent } from './components/alert/alert.component';

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
        AlertComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        HttpClientModule,
        InputTextModule,
        DialogModule,
        ButtonModule,
        AppRoutingModule,
        HttpModule,
        NgIdleKeepaliveModule.forRoot(),
        DataListModule,
        TabViewModule,
        PanelModule,
        ChartsModule

    ],
    providers: [SurveyService,
        PreguntasService,
        //customHttpProvider,
        ResultadoService,
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService],
    bootstrap: [AppComponent]
})
export class AppModule { }
