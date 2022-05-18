import {DataType, Model} from '../../../core';
import {userSettingsModel} from './UserSettingsModel';

export const userModel: Model = {
  name: 'user',
  attributes: {
    userId: {
      type: DataType.String,
      primaryKey: true
    },
    userName: {
      type: DataType.String,
      length: 255,
      nullable: true
    },
    firstName: {
      type: DataType.String,
      length: 255
    },
    middleName: {
      type: DataType.String,
      length: 255
    },
    lastName: {
      type: DataType.String,
      length: 255
    },
    displayName: {
      type: DataType.String,
      length: 255
    },
    gender: {
      type: DataType.String,
      length: 1
    },
    dateOfBirth: {
      type: DataType.DateTime
    },
    email: {
      type: DataType.String,
      length: 255
    },

    disable: {
      type: DataType.Bool,
    },
    status: {
      type: DataType.Object,
      // typeOf: UserStatus // TODO
    },
    maxPasswordAge: {
      type: DataType.Integer,
    },
    userType: {
      type: DataType.String,
    },
    sourceType: {
      type: DataType.String,
    },

    title: {
      type: DataType.String,
    },
    image: {
      type: DataType.String,
    },
    coverImage: {
      type: DataType.String,
    },
    nationality: {
      type: DataType.String,
    },
    alternativeEmail: {
      type: DataType.String,
    },
    phone: {
      type: DataType.String,
    },
    address: {
      type: DataType.String,
    },
    bio: {
      type: DataType.String,
    },
    website: {
      type: DataType.String,
    },
    occupation: {
      type: DataType.String,
    },
    company: {
      type: DataType.String,
    },
    lookingFor: {
      type: DataType.String,
    },
    remark: {
      type: DataType.String,
    },

    linkedinAccount: {
      type: DataType.String,
    },
    linkedinEmail: {
      type: DataType.String,
    },
    linkedinActive: {
      type: DataType.String,
    },
    googleAccount: {
      type: DataType.String,
    },
    googleEmail: {
      type: DataType.String,
    },
    googleActive: {
      type: DataType.String,
    },
    facebookAccount: {
      type: DataType.String,
    },
    facebookEmail: {
      type: DataType.String,
    },
    facebookActive: {
      type: DataType.String,
    },
    userNameActive: {
      type: DataType.String,
    },

    twitterLink: {
      type: DataType.String,
    },
    skypeLink: {
      type: DataType.String,
    },
    instagramLink: {
      type: DataType.String,
    },
    linkedinLink: {
      type: DataType.String,
    },
    dribbbleLink: {
      type: DataType.String,
    },
    googleLink: {
      type: DataType.String,
    },
    facebookLink: {
      type: DataType.String,
    },

    customLink01: {
      type: DataType.String,
    },
    customLink02: {
      type: DataType.String,
    },
    customLink03: {
      type: DataType.String,
    },
    customLink04: {
      type: DataType.String,
    },
    customLink05: {
      type: DataType.String,
    },
    customLink06: {
      type: DataType.String,
    },
    customLink07: {
      type: DataType.String,
    },
    customLink08: {
      type: DataType.String,
    },

    settings: {
      type: DataType.Object,
      typeOf: userSettingsModel,
      jsonField: 'data1.settings',
    },
    achievements: {
      type: DataType.Array,
      jsonField: 'data1.achievements',
      // typeOf: Achievement // TODO
    },
    interests: {
      type: DataType.Array,
      jsonField: 'data1.interests',
      // typeOf: Interest // TODO
    },
    skills: {
      type: DataType.Array,
      // typeOf: Skill // TODO
      jsonField: 'data2.skills',
    },
    appreciations: {
      type: DataType.Array,
      // typeOf: Appreciation // TODO,
      jsonField: 'data2.appreciations',
    },
    roles: {
      type: DataType.Array,
      // typeOf: DataType.String // TODO,
      jsonField: 'data2.roles',
    },
    organizationId: {
      type: DataType.String,
    },

/*
    longitude: {
      type: DataType.String,
    },
    latitude: {
      type: DataType.String,
    },
    lastInteractionTime: {
      type: DataType.String,
    },
    availableStatus: {
      type: DataType.String,
    },

    followerCount: {
      type: DataType.Integer,
    },
    followingCount: {
      type: DataType.Integer,
    },
    followingSpaceCount: {
      type: DataType.Integer,
    },
    */
  }
};
