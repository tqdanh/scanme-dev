import axios, {AxiosRequestConfig} from 'axios';
import {Observable, of, throwError} from 'rxjs';
import {fromPromise} from 'rxjs-compat/observable/fromPromise';
import {catchError, flatMap, map} from 'rxjs/operators';
import config from '../../config';
import {storage} from '../storage';
import {LoadingUtil} from './LoadingUtil';

export class WebClientUtil {
  public static getHttpOptions(): AxiosRequestConfig {
    const token = storage.getToken();
    if (token === null) {
      const httpOptions: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      };
      return httpOptions;
    } else {
      const httpOptions: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + token
        }
      };
      return httpOptions;
    }
  }

  public static getHttpOptions_Image(): AxiosRequestConfig {
    const token = storage.getToken();
    if (token === null) {
      const httpOptions: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'image/png'
        }
      };
      return httpOptions;
    } else {
      const httpOptions: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'image/png',
        }
      };
      return httpOptions;
    }
  }

  private static handleFailResponse<T>(data): Observable<T> {
    if (data && data.status === 'F' && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return throwError(data);
    } else {
      return of(data);
    }
  }

  public static get(url: string): Observable<object> {
    return fromPromise(axios.get(url, this.getHttpOptions())).pipe(map(item => {
      return item.data;
    })).pipe(flatMap(data => {
      return WebClientUtil.handleFailResponse(data);
    }));
  }

  public static getObject<T>(url: string): Observable<T> {
    return fromPromise(axios.get<T>(url, this.getHttpOptions()))
      .pipe(map(item => {
        return item.data;
      })).pipe(flatMap(data => {
        return WebClientUtil.handleFailResponse(data);
      }));
  }
  public static postObject<T>(url: string, obj: any, hideLoading: boolean = false): Observable<T> {
    const startTime = window.performance.now();
    if (!hideLoading) {
      LoadingUtil.showLoading();
    }

    return fromPromise(axios.post<T>(url, obj, this.getHttpOptions())).pipe(map(item => {
      const endTime = window.performance.now();
      LoadingUtil.hideLoading();
      /*
      const shouldThrowError = WebFormLogTrackService.handleResponse({details: item, processTime: endTime - startTime});
      if (shouldThrowError) {
        LoadingUtil.resetLoading();
        throwError(item);
      } else {*/
        return item.data;
      // }
    })).pipe(flatMap(data => {
      return WebClientUtil.handleFailResponse(data);
    })).pipe(catchError(errors => {
      const endTime = window.performance.now();
      LoadingUtil.resetLoading();
      return throwError(errors);
    }));
  }

  public static postObjectImage<T>(url: string, obj: any, hideLoading: boolean = false): Observable<T> {
    const startTime = window.performance.now();
    if (!hideLoading) {
      LoadingUtil.showLoading();
    }

    return fromPromise(axios.post<T>(url, obj, this.getHttpOptions_Image())).pipe(map(item => {
      const endTime = window.performance.now();
      LoadingUtil.hideLoading();
      /*
      const shouldThrowError = WebFormLogTrackService.handleResponse({details: item, processTime: endTime - startTime});
      if (shouldThrowError) {
        LoadingUtil.resetLoading();
        throwError(item);
      } else {*/
      return item.data;
      // }
    })).pipe(flatMap(data => {
      return WebClientUtil.handleFailResponse(data);
    })).pipe(catchError(errors => {
      const endTime = window.performance.now();
      LoadingUtil.resetLoading();
      return throwError(errors);
    }));
  }

  public static postRequest(url: string, obj: any): Observable<object> {
    return fromPromise(axios.post(url, obj, this.getHttpOptions())).pipe(map(item => {
      return item.data;
    })).pipe(flatMap(data => {
      return WebClientUtil.handleFailResponse(data);
    }));
  }

  public static deleteRequest(url: string): Observable<object> {
    return fromPromise(axios.delete(url, this.getHttpOptions())).pipe(map(item => {
      return item.data;
    })).pipe(flatMap(data => {
      return WebClientUtil.handleFailResponse(data);
    }));
  }

  public static deleteObject<T>(url: string, body?: any): Observable<T> {
    const _data = this.getHttpOptions();
    if (body) {
      _data.data = body;
    }
    return fromPromise(axios.delete(url, _data)).pipe(map(item => {
      return item.data;
    })).pipe(flatMap(data => {
      return WebClientUtil.handleFailResponse(data);
    }));
  }

  // public static postRequestUploadWithConfig(url: string, files: any[], configPost: any): Observable<object> {
  //   const uploaders = files.map(fileItem => {
  //     const formData = new FormData();
  //     formData.append('upload_preset', config.unsignedUploadPreset);
  //     formData.append('tags', 'albums'); // Optional - add tag for image admin in Cloudinary
  //     formData.append('api_key', config.apiKey);
  //     formData.append('folders', 'albums');
  //     formData.append('file', fileItem);
  //     // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
  //     return axios.post(url, formData, configPost);
  //   });
  //   // Once all the files are uploaded
  //   return fromPromise(
  //     axios.all(uploaders)
  //       .then(axios.spread((...args) => {
  //         return args;
  //       }))
  //   ).pipe(map(items => {
  //     return items.map(item => item.data);
  //   })).pipe(flatMap(data => {
  //     return WebClientUtil.handleFailResponse(data);
  //   }));
  // }

  public static putRequest(url: string, obj: any): Observable<object> {
    return fromPromise(axios.put(url, obj, this.getHttpOptions())).pipe(map(item => {
      return item.data;
    })).pipe(flatMap(data => {
      return WebClientUtil.handleFailResponse(data);
    }));
  }

  public static putObject<T>(url: string, obj: any): Observable<T> {
    return fromPromise(axios.put<T>(url, obj, this.getHttpOptions())).pipe(map(item => {
      return item.data;
    })).pipe(flatMap(data => {
      return WebClientUtil.handleFailResponse(data);
    }));
  }

  public static patchRequest(url: string, obj: any): Observable<object> {
    return fromPromise(axios.patch(url, obj, this.getHttpOptions())).pipe(map(item => {
      return item.data;
    })).pipe(flatMap(data => {
      return WebClientUtil.handleFailResponse(data);
    }));
  }

  public static patchObject<T>(url: string, obj: any): Observable<T> {
    return fromPromise(axios.patch<T>(url, obj, this.getHttpOptions())).pipe(map(item => {
      return item.data;
    })).pipe(flatMap(data => {
      return WebClientUtil.handleFailResponse(data);
    }));
  }
}
