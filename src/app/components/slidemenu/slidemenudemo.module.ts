import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {SlideMenuDemo} from './slidemenudemo';
import {SlideMenuDemoRoutingModule} from './slidemenudemo-routing.module';
import {SlideMenuModule} from '../slidemenu/slidemenu';
import {ButtonModule} from '../button/button';
import {TabViewModule} from '../tabview/tabview';
import {CodeHighlighterModule} from '../codehighlighter/codehighlighter';

@NgModule({
	imports: [
		CommonModule,
		SlideMenuDemoRoutingModule,
        SlideMenuModule,
        ButtonModule,
        TabViewModule,
        CodeHighlighterModule
	],
	declarations: [
		SlideMenuDemo
	]
})
export class SlideMenuDemoModule {}
