import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {v4 as uuidv4} from "uuid";

@Component({
  selector: 'app-accordion[header]',
  templateUrl: './accordion.component.html'
})
export class AccordionComponent implements OnInit {
  @Input() header: string;
  @Input() show:boolean=false;
  id: string = uuidv4();

  constructor() {
  }

  ngOnInit(): void {
  }

}
