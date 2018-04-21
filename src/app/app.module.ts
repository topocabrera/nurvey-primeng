import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule }  from 'primeng/inputtext';
import { ButtonModule }  from 'primeng/button';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';
import { RouterModule } from '@angular/router';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

import { HomeComponent } from './components/home/home.component';
import { SurveyEditorComponent } from './components/surveyeditor/survey.editor.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';
import { SurveyService } from './services/surveyservice';
import { LoginComponent } from './components/login/login.component';

// import { AlertComponent } from './shared/directives/index';
import { AuthGuard } from './components/guards/index';
import { AlertService, AuthenticationService, UserService } from './services/index';
import { PreguntasService } from './services/preguntas.service';
import { ResultadoService } from './services/resultados.service'


import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SurveyEditorComponent,
        LoginComponent
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
        NgIdleKeepaliveModule.forRoot()
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
