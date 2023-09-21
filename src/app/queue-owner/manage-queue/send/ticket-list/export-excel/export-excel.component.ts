import {Component, OnInit} from '@angular/core';
import {TicketVo} from "../../../../../models/TicketVo";
import html2canvas from "html2canvas";
import {QueueVo} from "../../../../../models/QueueVo";
import {ActivatedRoute, Router} from "@angular/router";
import {SurveyService} from "../../../../../_services/survey.service";
import {QueueService} from "../../../../../_services/queue.service";
import {ToastService} from "../../../../../_helpers/toast.service";
import {TicketService} from "../../../../../_services/ticket.service";
import {Location} from "@angular/common";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import {FilledSurveyVo} from "../../../../../models/FilledSurveyVo";
import {DateTimeUtils} from "../../../../../_utils/dateTimeUtils";

@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.css']
})
export class ExportExcelComponent implements OnInit {

  ticketVos: TicketVo[] = [];
  h2c: any = html2canvas;
  queueId: string;
  isLoading = false;  // 控制 spinner 的显示和隐藏的变量
  queueVo: QueueVo;
  date:string;
  constructor(private activateRoute: ActivatedRoute,
              private surveyService: SurveyService,
              private queueService: QueueService,
              private toastService: ToastService,
              private ticketService: TicketService,
              public router: Router,
              public dateTimeUtils: DateTimeUtils,
              private location: Location) {


  }

  ngOnInit(): void {

    Swal.showLoading();
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          Swal.close();
          this.queueVo = queueVo;
        }, error: err => {
          Swal.close();
          this.toastService.showErrorToast("Network error, please try again");
        }
      })
      this.activateRoute.queryParams.subscribe(params => {
        let ticketNos = params['ticketNos'];
        this.date = params['date'];
        if (history.state && history.state.allCheckedTickets) {
          // myData 存在，可以进行相应处理
          this.ticketVos = history.state.allCheckedTickets;
        } else {
          this.ticketService.findByTicketNos(this.queueId, this.date, ticketNos.split(","))
            .subscribe(data => {
                console.log(data)
                this.ticketVos = data.ticketVos;
              }
            );
        }
      });
    });
  }

  exportToExcel(): void {
    const options = { raw: true }; // 添加这个选项来禁用日期的自动转换
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('myTable'), options);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // 导出 Excel 文件
    XLSX.writeFile(wb, `${this.queueVo.queueName}-${this.date}.xlsx`);
  }

  joinTags(tagArray: any[]): string {
    return tagArray.map(tag => tag.tagContent).join('、');
  }
  back(): void {
    this.location.back()
  }
  toFillSurvey(filledSurveyVo: FilledSurveyVo): string[] {
    if (!filledSurveyVo) {
      return [];
    } else {
      // 使用 map() 函数返回处理后的数组
      const surveyResults = filledSurveyVo.survey.pages.map(page => {
        const element = page.elements[0];
        const question = element.question;
        let type = question.type;
        if (type === 'SHORT_TEXT') {
          const shortText = question.shortText;
          return `${shortText.question}: ${shortText.answer};`;
        }
        if (type === 'SINGLE_CHOICE_QUESTION') {
          const singleChoiceQuestion = question.singleChoiceQuestion;
          let join = singleChoiceQuestion.radioOptions.filter(x=>x.id==singleChoiceQuestion.answer)
            .map(x=>x.text).join("、");
          return `${singleChoiceQuestion.question}: ${join};`;
        }
        if (type === 'MULTIPLE_CHOICE_QUESTION') {
          const multipleChoiceQuestion = question.multipleChoiceQuestion;
          let join = multipleChoiceQuestion.radioOptions.filter(x=>multipleChoiceQuestion.answer.includes(x.id))
            .map(x=>x.text).join("、");
          return `${multipleChoiceQuestion.question}: ${join};`;
        }
        // 可以在这里添加其他类型的处理逻辑，比如单选题、多选题等
        return ''; // 返回空字符串表示未知类型
      });
      // 使用 join() 函数将结果数组合并为一个字符串，用换行分隔
      return surveyResults;
    }
  }

}
