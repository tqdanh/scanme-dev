import {MessageFactory} from '../../message-factory/MessageFactory';
import {BaseRequest} from '../../message/BaseRequest';
import {BaseModel} from '../../model/BaseModel';
import {ErrorMessage} from '../../model/ErrorMessage';
import {StringUtil} from '../../util/StringUtil';

export class AbstractBaseService {
  validateBaseRequest(request: BaseRequest<BaseModel>): ErrorMessage[] {
    const errors = new Array<ErrorMessage>();
    if (request.header == null || !StringUtil.isPhoneNumber(request.header.mobileNo)) {
      errors.push(MessageFactory.getInvalidMobileNumber());
    }
    return errors;
  }

  validateBaseAndRequiredData(request: BaseRequest<BaseModel>): ErrorMessage[] {
    const errors = this.validateBaseRequest(request);
    if (request.data == null) {
      errors.push(MessageFactory.getRequiredFieldNotFound());
    }
    return errors;
  }
}
