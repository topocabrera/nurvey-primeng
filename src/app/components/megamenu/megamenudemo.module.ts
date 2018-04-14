import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {MegaMenuDemo} from './megamenudemo';
import {MegaMenuDemoRoutingModule} from './megamenudemo-routing.module';
import {MegaMenuModule} from '../megamenu/megamenu';
import {TabViewModule} from '../tabview/tabview';
import {CodeHighlighterModule} from '../codehighlighter/codehighlighter';

 
@NgModule({
	imports: [
		CommonModule,
		MegaMenuDemoRoutingModule,
        MegaMenuModule,
        TabViewModule,
        CodeHighlighterModule
	],
	declarations: [
		MegaMenuDemo
	]
})
export class MegaMenuDemoModule {}
