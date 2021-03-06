import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { DataTableComponent } from './data-table/data-table.component';


@NgModule({
  declarations: [DataTableComponent],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [DataTableComponent]
})
export class SharedModule { }
