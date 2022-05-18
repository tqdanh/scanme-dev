export class UserSettings {
  constructor(
    public userId?: string,
    public defaultLanguage = Language.ENGLISH,
    public dateFormat = DateFormat.YYYYMMDD,
    public dateTimeFormat = DateTimeFormat.LONG,
    public timeFormat = TimeFormat.HHMMSS,
    public notification = false,
    public searchEnginesLinksToMyProfile = false,
    public emailFeedUpdates = false,
    public notifyFeedUpdates = false,
    public emailPostMentions = false,
    public notifyPostMentions = false,
    public emailCommentsOfYourPosts = false,
    public notifyCommentsOfYourPosts = false,
    public emailEventInvitations = false,
    public notifyEventInvitations = false,
    public emailWhenNewEventsAround = false,
    public notifyWhenNewEventsAround = false,
  ) {}

}

export enum Language {
  ENGLISH = 'en',
  VIETNAMESE = 'vi'
}

export enum TimeFormat {
  HHMMSS = 'HH:mm:ss'
}

export enum DateFormat {
  YYYYMMDD = 'YYYY/MM/DD',
  DDMMYYYY = 'DD/MM/YYYY'
}

export enum DateTimeFormat {
  LONG = 'YYYY/MM/DD HH:mm:ss'
}
