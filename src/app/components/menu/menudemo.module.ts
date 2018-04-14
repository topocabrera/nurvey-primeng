import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuDemo} from './menudemo';
import {MenuDemoRoutingModule} from './menudemo-routing.module';
import {MenuModule} from '../menu/menu'
import {ButtonModule} from '../button/button';;
import {TabViewModule} from '../tabview/tabview';
import {CodeHighlighterModule} from '../codehighlighter/codehighlighter';

@NgModule({
	imports: [
		CommonModule,
		MenuDemoRoutingModule,
        MenuModule,
        ButtonModule,
        TabViewModule,
        CodeHighlighterModule
	],
	declarations: [
		MenuDemo
	]
})
export class MenuDemoModule {}
