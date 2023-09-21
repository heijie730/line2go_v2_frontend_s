import {Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

import {environment} from "../../environments/environment";
import {from, Observable, of, throwError} from "rxjs";
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import {v4 as uuidv4} from "uuid";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";

// import {SQS} from "aws-sdk";

@Injectable({
  providedIn: 'root'
})
export class AwsService {

  private s3: S3;
  // private sqs: SQS;
  private bucketName = environment.aws.bucketName;
  private accessKeyId = environment.aws.accessKeyId;
  private secretAccessKey = environment.aws.secretAccessKey;
  private region = environment.aws.region;

  // public static self: AwsService;

  constructor(private http: HttpClient) {
    AWS.config.update({
      signatureVersion: 'v4'
    });
    this.s3 = new S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: this.region
    });
  }

  uploadFile(file: File, folder: string): Observable<ManagedUpload.SendData> {
    const contentType = file.type;
    const extension = file.name.split('.').pop(); // 获取文件扩展名
    const key = folder + '/' + uuidv4() + '.' + extension; // 使用 UUID 和文件扩展名来生成新的 Key
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ACL: 'private',
      ContentType: contentType
    };
    return new Observable(observer => {
      this.s3.upload(params, (err: Error, data: ManagedUpload.SendData) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(data);
          observer.complete();
        }
      });
    });
  }

  getFileUrl(key: string): Observable<string> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: 3600
    };
    return new Observable(observer => {
      this.s3.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(url);
          observer.complete();
        }
      });
    });
  }

  private getKeyFromUrl(url: string): string {
    const urlObject = new URL(url);

    // split path into parts
    const pathParts = urlObject.pathname.split('/');

    // remove the first part (which is empty because the path starts with a /)
    pathParts.shift();

    // remove the bucket name
    pathParts.shift();

    // join the rest back together to get the key
    const key = pathParts.join('/');

    return key;
  }

  checkAndRefreshUrl(url: string): Observable<string> {
    if (this.isUrlExpired(url)) {
      // replace this with your method to get a new URL
      let key = this.getKeyFromUrl(url);
      return this.getFileUrl(key);
    } else {
      return from([url]);
    }
  }

  private isUrlExpired(url: string): boolean {
    const urlObject = new URL(url);

    const dateString = urlObject.searchParams.get('X-Amz-Date');
    const expiresInString = urlObject.searchParams.get('X-Amz-Expires');

    if (!dateString || !expiresInString) {
      return false;
    }

    const date = this.parseAmzDate(dateString);
    const expiresIn = parseInt(expiresInString, 10);

    const expirationDate = new Date(date.getTime() + expiresIn * 1000);

    return new Date() > expirationDate;
  }

  private parseAmzDate(dateString: string): Date {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hours = dateString.substring(9, 11);
    const minutes = dateString.substring(11, 13);
    const seconds = dateString.substring(13, 15);

    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`);
  }

}
