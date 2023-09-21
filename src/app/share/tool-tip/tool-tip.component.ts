import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';

@Component({
  selector: 'app-tool-tip',
  templateUrl: './tool-tip.component.html',
  styleUrls: ['./tool-tip.component.css']
})
export class ToolTipComponent implements OnInit {
  @Input() content: string;
  @Input() direction: string='bottom';
  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    const iElement = this.elementRef.nativeElement.querySelector('i');
    this.renderer.setAttribute(iElement, 'data-bs-title', this.content);
    this.renderer.setAttribute(iElement, 'data-bs-placement', this.direction);

  }

}
