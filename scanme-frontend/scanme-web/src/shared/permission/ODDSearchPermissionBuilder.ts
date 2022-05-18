import {PermissionUtil, SearchPermission, SearchPermissionBuilder, UserAccount} from '../../core';

export class ODDSearchPermissionBuilder implements SearchPermissionBuilder {
  buildPermission(user: UserAccount, url: string): SearchPermission {
    let p: SearchPermission;
    if (!user) {
      p = {
        'searchable': false,
        'viewable': false,
        'addable': false,
        'editable': false,
        'approvable': false,
        'deletable': false
      };
    } else {
      const userType = user.userType;
      const userModules = user.modules;
      p = {
        'searchable': false,
        'viewable': false,
        'addable': false,
        'editable': false,
        'approvable': false,
        'deletable': false
      };
      if (PermissionUtil.existLink(userModules, url)) {
        if (userType === 'M') { // TODO use enum
          p = {
            'searchable': true,
            'viewable': true,
            'addable': true,
            'editable': true,
            'approvable': false,
            'deletable': false
          };
        } else if (userType === 'C') { // TODO use enum
          p = {
            'searchable': true,
            'viewable': true,
            'addable': false,
            'editable': false,
            'approvable': true,
            'deletable': false
          };
        } else {
          p = {
            'searchable': false,
            'viewable': false,
            'addable': false,
            'editable': false,
            'approvable': false,
            'deletable': false
          };
        }
      }
      }
    return p;
  }
}
