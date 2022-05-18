import {Language} from '../Language';

export interface LocaleModelFormatter<T, K> {
  format(obj: T, locale: Language): K;
}
