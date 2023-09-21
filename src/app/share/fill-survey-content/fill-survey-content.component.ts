import { Component, Input, OnInit } from '@angular/core';
import { QuestionType } from 'src/app/models/survey/Question';
import { FilledSurveyVo } from "../../models/FilledSurveyVo";
import { Page } from "../../models/survey/Page";
import { CustomUtils } from "../../_utils/CustomUtils";
import { RadioOption } from "../../models/survey/RadioOption";
import Swal from "sweetalert2";

@Component({
  selector: 'app-fill-survey-content[filledSurveyVo][disabled]',
  templateUrl: './fill-survey-content.component.html',
  styleUrls: ['./fill-survey-content.component.css']
})
export class FillSurveyContentComponent implements OnInit {
  @Input() filledSurveyVo: FilledSurveyVo;
  @Input() disabled: boolean;
  QuestionType = QuestionType;

  constructor(public customUtils: CustomUtils) {
  }

  ngOnInit(): void {
  }

  // Toggle the selection of an option
  toggleOptionSelection(pageIndex: number, optionId: string) {
    const index = this.filledSurveyVo.survey.pages[pageIndex].elements[0].question.multipleChoiceQuestion.answer.indexOf(optionId);
    if (index === -1) {
      this.filledSurveyVo.survey.pages[pageIndex].elements[0].question.multipleChoiceQuestion.answer.push(optionId);
    } else {
      this.filledSurveyVo.survey.pages[pageIndex].elements[0].question.multipleChoiceQuestion.answer.splice(index, 1);
    }
  }

  radioChange(radioOption: RadioOption) {
    if (radioOption.allowInput) {
      Swal.fire({
        title: 'Input Content',
        input: 'text',
        inputValue: radioOption.text,
        inputValidator: (value) => {
          if (!value) {
            return 'Please enter content';
          }
          return null;
        },
        inputPlaceholder: 'Enter here',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          radioOption.text = result.value;
        }
      });
    }
  }

  checkBoxChange(radioOption: RadioOption) {
    if (radioOption.allowInput) {
      Swal.fire({
        title: 'Input Content',
        input: 'text',
        inputValue: radioOption.text,
        inputValidator: (value) => {
          if (!value) {
            return 'Please enter content';
          }
          return null;
        },
        inputPlaceholder: 'Enter here',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          radioOption.text = result.value;
        }
      });
    }
  }
}
