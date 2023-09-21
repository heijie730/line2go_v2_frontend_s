import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AfterTicketTaken, QueueVo, Tag} from "../../models/QueueVo";
import {TagVo} from "../../models/TagVo";
import {v4 as uuidv4} from "uuid";

@Component({
  selector: 'app-select-tag[title][tags][queue][tagsChange]',
  templateUrl: './select-tag.component.html',
  styleUrls: ['./select-tag.component.css']
})
export class SelectTagComponent implements OnInit {
  @Input() title: string;
  @Input() tags: Tag[];
  @Input() queue: QueueVo;
  @Output() tagsChange = new EventEmitter<Tag[]>();

  tagVos: TagVo[] = [];
  randomId: string = uuidv4();

  constructor() {
  }


  ngOnInit(): void {
    this.tagVos = this.queue.tags.map(x => x.toTagVo(this.tags));
  }

  change() {
    this.tags = this.tagVos.filter(x => x.checked).map(x => x.toTag());
    this.tagsChange.emit(this.tags);
  }

}
