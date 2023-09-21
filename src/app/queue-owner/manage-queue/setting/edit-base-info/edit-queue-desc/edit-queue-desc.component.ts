import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Swal from "sweetalert2";
import {ActivatedRoute} from "@angular/router";
import {ToastService} from "../../../../../_helpers/toast.service";
import {AwsService} from "../../../../../_services/aws-service.service";
import {CustomUtils} from "../../../../../_utils/CustomUtils";
import {QueueService} from "../../../../../_services/queue.service";
import {QueueVo} from "../../../../../models/QueueVo";
import {RichTextVo, TextType} from "../../../../../models/RichTextVo";
import Quill from "quill";
import Compressor from "compressorjs";
import * as bootstrap from "bootstrap";

@Component({
  selector: 'app-edit-queue-desc',
  templateUrl: './edit-queue-desc.component.html',
  styleUrls: ['./edit-queue-desc.component.css']
})
export class EditQueueDescComponent implements OnInit , AfterViewInit {
  queueDesc: string = '';
  queue: QueueVo;

  constructor(
    private activateRoute: ActivatedRoute,
    private toastService: ToastService,
    private awsService: AwsService, private customUtils: CustomUtils,
    private queueService: QueueService) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      let queueId = params['id'];
      Swal.showLoading();
      this.queueService.findById(queueId).subscribe({
        next: queueVO => {
          Swal.close()
          console.log('data', queueVO);
          this.queue = queueVO;
        },
        error: err => {
          Swal.close()
          console.log('Fail', err);
          this.toastService.showErrorToast("Operation failed", "Server error");
        }
      });
    });
  }
  ngAfterViewInit() {
    this.loadInlineCss();
  }

  loadQueueDesc() {
    this.activateRoute.params.subscribe(params => {
      let queueId = params['id'];
      this.queueService.findRichText(queueId, TextType.QUEUE_DESC).subscribe({
        next: queueDescVo => {
          console.log('data', queueDescVo);
          if (queueDescVo.errcode == 0) {
            this.queueDesc = queueDescVo.content
            this.quillEditor.root.innerHTML = this.queueDesc;

          }
        },
        error: err => {
          console.log('Fail', err);
        }
      });
    });

  }

  editQueueDesc() {
    this.queueDesc = this.quillEditor.root.innerHTML;
    let richTextVo = new RichTextVo();
    richTextVo.queueId = this.queue.id;
    richTextVo.content = this.queueDesc;
    richTextVo.textType = TextType.QUEUE_DESC;
    this.queueService.updateRichText(richTextVo).subscribe({
      next: result => {
        console.log('save Success', result);
        if (result.errcode == 0) {
          this.toastService.showSuccessToast('Update successful');
        }
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");

      }
    });
  }
  @ViewChild('editor') editorElementRef: ElementRef;

  private quillEditor: Quill;

  // Quill 配置
  quillConfig = {
    modules: {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote'],

          [{'header': 1}, {'header': 2}],               // custom button values
          [{'list': 'ordered'}, {'list': 'bullet'}],
          [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
          [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
          [{'direction': 'rtl'}],                         // text direction

          // [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
          [{'header': [1, 2, 3, 4, 5, 6, false]}],

          [{'color': []}, {'background': []}],          // dropdown with defaults from theme
          [{'font': []}],
          [{'align': []}],

          ['clean'],                                         // remove formatting button

          ['image', 'link'], // link and image, video
        ],
        handlers: {
          'image': this.imageHandler.bind(this),
          'link': this.customLinkHandler.bind(this)  // 为自定义链接按钮绑定事件处理器
        },
      }
    }
    , theme: 'snow'
  };

  customLinkHandler() {
    var range = this.quillEditor.getSelection();
    if (range?.length == 0) {
      this.toastService.showAlertWithError("Please select text before attaching a link.");
      return;
    }
    let childQueues = this.queue.childQueueManager.childQueues;
    if (childQueues.length == 0) {
      this.toastService.showAlertWithError("You need to add child queues before adding links to text. Please go to [Settings] -> [Child Queue Management] to add child queues.")
      return;
    }
    let queueMap: { [key: string]: string } = {}; // Explicitly specify object type and index signature
    childQueues.forEach(x => {
      let childQueueUrl = this.customUtils.buildChildQueueUrl(x.queueId);
      queueMap[childQueueUrl] = x.remark; // Use childQueueUrl as key and remark as value
    });
    Swal.fire({
      title: 'Please select a child queue',
      input: 'select',
      inputOptions: queueMap,
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      inputValidator: (value) => {
        if (!value) {
          return 'Please select a child queue';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const userChoice = result.value;
        // Handle user's choice
        console.log('User choice:', userChoice);
        this.addLink(userChoice);
      }
    });
  }

// 自定义链接事件处理器
  addLink(value: string) {
    var range = this.quillEditor.getSelection();
    if (range) {
      this.quillEditor.formatText(range.index, range.length, 'link', value);
    }
  }

// New image handling function
  imageHandler() {
    // Define regular expression
    const imageRegExp = /<img[^>]*>/gi;
    // Get rich text content
    const content = this.quillEditor.root.innerHTML;
    // Search for image tags
    let matches = content.match(imageRegExp);
    // Get the number of images
    let imageCount = matches ? matches.length : 0;
    console.log('Current image count:', imageCount);
    if (imageCount >= 10) {
      this.toastService.showErrorToast("Images cannot exceed 10");
      return;
    }
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    // Listen for the file input change event
    input.onchange = () => {
      // @ts-ignore
      const file = input.files[0];

      // Check if the file is an image
      if (/^image\//.test(file.type)) {
        if (file.size > 1024 * 1024 * 10) {
          this.toastService.showErrorToast("Image size cannot exceed 10MB, please compress the image size first");
          return;
        }
        // Using the method
        this.compressFile(file).then(compressedFile => {
          // Check the file size, if it's larger than 2MB, reject
          // Show the loading toast before starting the image upload
          Swal.showLoading();
          this.awsService.uploadFile(<File>compressedFile, 'queue_desc_images').subscribe({
            next: data => {
              console.log('File uploaded:', data);
              let key = data.Key;
              this.awsService.getFileUrl(key).subscribe({
                next: data => {
                  const range = this.quillEditor.getSelection(true);
                  this.quillEditor.insertEmbed(range.index, 'image', data);
                  this.queueDesc = this.quillEditor.root.innerHTML;
                  Swal.close();
                }
              });
            },
            error: error => {
              console.error('Upload error:', error);
              Swal.close();
              this.toastService.showErrorToast("Image upload failed")
            }
          })
        })

      } else {
        console.warn('You could only upload images.');
        this.toastService.showErrorToast("Please select an image type")
      }
    }
  }

// Create a Compressor instance
  compressFile(file: File) {
    console.log("Size before compression:", file.size);
    return new Promise((resolve, reject) => {
      const compressor = new Compressor(file, {
        quality: 0.6, // Compression quality
        success(result) {
          console.log("Size after compression:", result.size);
          resolve(result);
        },
        error(err) {
          reject(err);
        }
      });
    });
  }

  loadInlineCss() {
    // configure Quill to use inline styles so the email's format properly
    var DirectionAttribute = Quill.import('attributors/attribute/direction');
    Quill.register(DirectionAttribute, true);

    var AlignClass = Quill.import('attributors/class/align');
    Quill.register(AlignClass, true);

    var BackgroundClass = Quill.import('attributors/class/background');
    Quill.register(BackgroundClass, true);

    var ColorClass = Quill.import('attributors/class/color');
    Quill.register(ColorClass, true);

    var DirectionClass = Quill.import('attributors/class/direction');
    Quill.register(DirectionClass, true);

    var FontClass = Quill.import('attributors/class/font');
    Quill.register(FontClass, true);

    var SizeClass = Quill.import('attributors/class/size');
    Quill.register(SizeClass, true);

    var AlignStyle = Quill.import('attributors/style/align');
    Quill.register(AlignStyle, true);

    var BackgroundStyle = Quill.import('attributors/style/background');
    Quill.register(BackgroundStyle, true);

    var ColorStyle = Quill.import('attributors/style/color');
    Quill.register(ColorStyle, true);

    var DirectionStyle = Quill.import('attributors/style/direction');
    Quill.register(DirectionStyle, true);

    var FontStyle = Quill.import('attributors/style/font');
    Quill.register(FontStyle, true);

    var SizeStyle = Quill.import('attributors/style/size');
    Quill.register(SizeStyle, true);
    // create new Quill instance here...
    this.quillEditor = new Quill(this.editorElementRef.nativeElement, this.quillConfig);
    this.loadQueueDesc();

  }

  preview() {
    this.queueDesc = this.quillEditor.root.innerHTML;
    this.showModal('previewBackdrop');
  }

  showModal(id: string): void {
    const myModalEl = document.getElementById(id);
    if (myModalEl) {
      const modal = new bootstrap.Modal(myModalEl);
      modal.show();
    } else {
      console.error(`Modal element with ID ${id} not found.`);
    }
  }
}
