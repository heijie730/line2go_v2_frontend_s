import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import * as bootstrap from 'bootstrap'; // 导入 Bootstrap

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
}
