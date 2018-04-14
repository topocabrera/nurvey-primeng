import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {GrowlDemo} from './growldemo';
import {GrowlDemoRoutingModule} from './growldemo-routing.module';
import {GrowlModule} from '../growl/growl';
import {ButtonModule} from '../button/button';
import {TabViewModule} from '../tabview/tabview';
import {CodeHighlighterModule} from '../codehighlighter/codehighlighter';

@NgModule({
	imports: [
		CommonModule,
		GrowlDemoRoutingModule,
        GrowlModule,
        ButtonModule,
        TabViewModule,
        CodeHighlighterModule
	],
	declarations: [
		GrowlDemo
	]
})
export class GrowlDemoModule {}
