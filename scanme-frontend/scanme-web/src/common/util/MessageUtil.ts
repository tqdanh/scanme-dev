import {SearchModel} from '../model/SearchModel';
import {SearchResult} from '../model/SearchResult';
import {StatusCode} from '../model/StatusCode';
import {ResourceManager} from '../ResourceManager';
import {SearchUtil} from './SearchUtil';

export class MessageUtil {
  public static buildMessageFromHttpStatus(status: number): string {
    let msg = ResourceManager.getString('error_unauthorized'); // ResourceManager.getString('error_network');
    if (status === 401) {
      msg = ResourceManager.getString('error_unauthorized');
    } else if (status === 403) {
      msg = ResourceManager.getString('error_forbidden');
    } else if (status === 500) {
      msg = ResourceManager.getString('error_internal');
    } else if (status === 503) {
      msg = ResourceManager.getString('error_service_unavailable');
    }
    return msg;
  }

  public static buildMessageFromStatusCode(status: StatusCode): string {
    if (status === StatusCode.RequiredIdError) {
      return ResourceManager.getString('error_required_id');
    } else if (status === StatusCode.DuplicatedIdError) {
      return ResourceManager.getString('error_duplicated_id');
    } else if (status === StatusCode.DataVersionError) { // Below message for update only, not for add
      return ResourceManager.getString('error_data_version');
    } else if (status === StatusCode.DataCorruptError) {
      return ResourceManager.getString('error_data_corrupt');
    } else {
      return '';
    }
  }

  public static buildSearchMessage<T>(s: SearchModel, sr: SearchResult<T>): string {
    const results = sr.results;
    if (!results || results.length === 0) {
      return ResourceManager.getString('msg_no_data_found');
    } else {
      if (!s.pageIndex) {
        s.pageIndex = 1;
      }
      const fromIndex = (s.pageIndex - 1) * s.pageSize + 1;
      const toIndex = fromIndex + results.length - 1;
      const pageTotal = SearchUtil.getPageTotal(sr.itemTotal, s.pageSize);
      if (pageTotal > 1) {
        const msg2 = this.format(ResourceManager.getString('msg_search_result_page_sequence'), fromIndex, toIndex, sr.itemTotal, s.pageIndex, pageTotal);
        return msg2;
      } else {
        const msg3 = this.format(ResourceManager.getString('msg_search_result_sequence'), fromIndex, toIndex);
        return msg3;
      }
    }
  }

  private static format(...args: any[]): string {
    let formatted = args[0];
    if (!formatted || formatted === '') {
      return '';
    }
    if (args.length > 1 && Array.isArray(args[1])) {
      const params = args[1];
      for (let i = 0; i < params.length; i++) {
        const regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, params[i]);
      }
    } else {
      for (let i = 1; i < args.length; i++) {
        const regexp = new RegExp('\\{' + (i - 1) + '\\}', 'gi');
        formatted = formatted.replace(regexp, args[i]);
      }
    }
    return formatted;
  }
}
