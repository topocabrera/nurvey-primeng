import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabViewDemo} from './tabviewdemo';
import {TabViewDemoRoutingModule} from './tabviewdemo-routing.module';
import {GrowlModule} from '../growl/growl';
import {TabViewModule} from '../tabview/tabview';
import {CodeHighlighterModule} from '../codehighlighter/codehighlighter';

@NgModule({
	imports: [
		CommonModule,
		TabViewDemoRoutingModule,
        GrowlModule,
        TabViewModule,
        CodeHighlighterModule
	],
	declarations: [
		TabViewDemo
	]
})
export class TabViewDemoModule {}
