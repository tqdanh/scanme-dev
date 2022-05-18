import {EditPermission, EditPermissionBuilder, UserAccount} from '../../core';
import {PermissionUtil} from '../../core';

export class ODDEditPermissionBuilder implements EditPermissionBuilder {
  buildPermission(user: UserAccount, url: string): EditPermission {
    let p: EditPermission;
    if (!user) {
      p = {
        'viewable': false,
        'addable': false,
        'editable': false,
        'deletable': false
      };
    } else {
      const userType = user.userType;
      const userModules = user.modules;
      p = {
        'viewable': false,
        'addable': false,
        'editable': false,
        'deletable': false
      };
      if (PermissionUtil.existLink(userModules, url)) {
        if (userType === 'M') { // TODO use enum
          p = {
            'viewable': true,
            'addable': true,
            'editable': true,
            'deletable': false
          };
        } else if (userType === 'C') { // TODO use enum
          p = {
            'viewable': true,
            'addable': false,
            'editable': false,
            'deletable': false
          };
        } else {
          p = {
            'viewable': false,
            'addable': false,
            'editable': false,
            'deletable': false
          };
        }
      }
      }
    return p;
  }
}
