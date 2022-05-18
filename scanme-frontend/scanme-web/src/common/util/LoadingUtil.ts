import {UIUtil} from './UIUtil';

export class LoadingUtil {
  private static count = 0;
  private static isFirstTime = true;

  public static setIsFirstTime(isFirstTime) {
    this.isFirstTime = isFirstTime;
  }

  public static showLoading() {
    this.count++;
    if (this.count >= 1) {
      UIUtil.showLoading(this.isFirstTime);
    }
  }

  public static hideLoading() {
    if (this.count > 0) {
      this.count = this.count - 1;
    }
    if (this.count === 0) {
      UIUtil.hideLoading();
    }
  }

  public static resetLoading() {
    this.count = 0;
    UIUtil.hideLoading();
  }
}
