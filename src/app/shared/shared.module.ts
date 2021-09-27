import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DebounceClickDirective} from './directives/debounce-click/debounce-click.directive';


@NgModule({
  declarations: [
    DebounceClickDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DebounceClickDirective
  ]
})
export class SharedModule {
}
