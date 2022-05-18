import { ErrorDescription } from '../model/ErrorDescription';
import { ErrorMessage } from '../model/ErrorMessage';
import { MessageId } from './MessageId';

export class MessageFactory {
  public static getItemNotExisted(): ErrorMessage {
    const error = new ErrorMessage();
    error.code = MessageId.ItemNotExistedCode;
    error.message = 'Item Not Existed.';
    return error;
  }
  public static getRequiredFieldNotFound(): ErrorMessage {
    const error = new ErrorMessage();
    error.code = MessageId.RequiredFieldNotFoundCode;
    error.message = 'Required field(s) is(are) missing, invalid value or invalid format.';
    return error;
  }

  public static getDuplicateID(): ErrorMessage {
    const error = new ErrorMessage();
    error.code = MessageId.DuplicateIDCode;
    error.message = 'Duplicate ID.';
    return error;
  }

  public static getIDNotFound(): ErrorMessage {
    const error = new ErrorMessage();
    error.code = MessageId.DuplicateIDCode;
    error.message = 'ID Not Found.';
    return error;
  }

  public static getSystemError(): ErrorMessage {
    const error = new ErrorMessage();
    error.code = MessageId.SystemErrorCode;
    error.message = 'System error. Please try again later.';
    return error;
  }

  public static getCannotDecodePassword(): ErrorMessage {
    const error = new ErrorMessage();
    error.code = MessageId.CannotDecodePasswordCode;
    error.message = 'Cannot decode password.';
    return error;
  }

  public static getEmailInvalid(): ErrorMessage {
    const error = new ErrorMessage();
    error.code = MessageId.EmailInvalidCode;
    error.message = 'Email invalid format.';
    return error;
  }

  public static getUsernameAlreadyInUse(): ErrorMessage {
    const error = new ErrorMessage();
    error.code = MessageId.UsernameAlreadyInUseCode;
    error.message = 'Username already in use.';
    return error;
  }

  public static getUserAlreadyActivated(): ErrorMessage {
    const error = new ErrorMessage();
    error.code = MessageId.UserAlreadyActivatedCode;
    error.message = 'Username already activated.';
    return error;
  }

  public static getEmailAlreadyInUse(): ErrorMessage {
    const error = new ErrorMessage();
    error.code = MessageId.EmailAlreadyInUseCode;
    error.message = 'Email already in use.';
    return error;
  }

  public static getPasscodeInvalid(): ErrorMessage {
    const error = new ErrorMessage();
    error.code = MessageId.PasscodeInvalidCode;
    error.message = 'Passcode invalid.';
    return error;
  }

  public static getInvalidMobileNumber(): ErrorMessage {
    const error = new ErrorMessage();
    error.code = MessageId.InvalidMobileNumberCode;
    error.message = 'Invalid mobile number from service request.';
    return error;
  }
  public static getNotFoundImageCloud(): ErrorMessage {
    const error = new ErrorMessage();
    error.code = MessageId.SystemErrorCode;
    error.message = 'NotFound image Cloud';
    return error;
  }
  public static getOutOfAccessTime(): ErrorDescription {
    const error = new ErrorDescription();
    error.code = MessageId.OutOfAccessTime;
    error.description = 'Out of allowed access times.';
    return error;
  }
  public static getDontHavePermission(): ErrorDescription {
    const error = new ErrorDescription();
    error.code = MessageId.DontHavePermission;
    error.description = 'You don\'t have Permission.';
    return error;
  }
  public static getInternalServerError(): ErrorDescription {
    const error = new ErrorDescription();
    error.code = MessageId.InternalServerError;
    error.description = 'Internal Server Error.';
    return error;
  }
  public static getTokenExpired(): ErrorDescription {
    const error = new ErrorDescription();
    error.code = MessageId.TokenExpired;
    error.description = 'The token expired.';
    return error;
  }
  public static getTokenInvalid(): ErrorDescription {
    const error = new ErrorDescription();
    error.code = MessageId.TokenInvalid;
    error.description = 'The token invalid.';
    return error;
  }
  public static getTokenError(): ErrorDescription {
    const error = new ErrorDescription();
    error.code = MessageId.TokenError;
    error.description = 'The token has been revoked.';
    return error;
  }
  public static getAlreadyApprovedOrReject(): ErrorDescription {
    const error = new ErrorDescription();
    error.code = MessageId.AlreadyApprovedOrReject;
    error.description = 'Already Approved Or Reject';
    return error;
  }
  public static getItemNotExisted1(): ErrorDescription {
    const error = new ErrorDescription();
    error.code = MessageId.ItemNotExistedCode;
    error.description = 'Item Not Existed.';
    return error;
  }
  public static getInvalidData(): ErrorDescription {
    const error = new ErrorDescription();
    error.code = MessageId.InvalidData;
    error.description = 'Invalid Data.';
    return error;
  }
}
