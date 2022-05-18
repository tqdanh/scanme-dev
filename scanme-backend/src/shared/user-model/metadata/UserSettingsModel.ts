import {DataType, Model} from '../../../core';

export const userSettingsModel: Model = {
  name: 'settings',
  attributes: {
    userId: {
      type: DataType.String
    },
    defaultLanguage: {
      type: DataType.String,
      length: 11
    },
    dateFormat: {
      type: DataType.String,
      length: 13
    },
    dateTimeFormat: {
      type: DataType.String,
      length: 40
    },
    timeFormat: {
      type: DataType.String,
      length: 10
    },
    notification: {
      type: DataType.Bool
    },
    searchEnginesLinksToMyProfile: {
      type: DataType.Bool
    },
    emailFeedUpdates: {
      type: DataType.Bool
    },
    notifyFeedUpdates: {
      type: DataType.Bool
    },
    emailPostMentions: {
      type: DataType.Bool
    },
    notifyPostMentions: {
      type: DataType.Bool
    },
    emailCommentsOfYourPosts: {
      type: DataType.Bool
    },
    notifyCommentsOfYourPosts: {
      type: DataType.Bool
    },
    emailEventInvitations: {
      type: DataType.Bool
    },
    notifyEventInvitations: {
      type: DataType.Bool
    },
    emailWhenNewEventsAround: {
      type: DataType.Bool
    },
    notifyWhenNewEventsAround: {
      type: DataType.Bool
    }
  }
};
