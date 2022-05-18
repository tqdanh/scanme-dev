import * as moment from 'moment';

export class DateUtil {
  private static _datereg = '/Date(';
  private static _re = /-?\d+/;
  private static _timeReg = /(\d+)(:(\d\d))?\s*(p?)/i;
  private static __formatDate = 'MM/dd/yyyy';

  public static getFormatDate() {
    return this.__formatDate;
  }

  public static toISO(date): string {
    if (!date || date === '') {
      return '';
    }
    return moment(date).format();
  }

  public static convertJsonDateToLong(dateStr) {
    if (!dateStr) {
      return null; // new Date('1/1/1900');
    }
    const m = this._re.exec(dateStr);
    return parseInt(m[0], 10);
  }
  public static convertJsonToDate(dateStr) {
    if (!dateStr || dateStr === '') {
      return null;
    }
    const i = dateStr.indexOf(this._datereg);
    if (i >= 0) {
      const m = this._re.exec(dateStr);
      const d = parseInt(m[0], 10);
      const date = new Date(d);
      return date;
    } else {
      if (isNaN(dateStr)) {
        const date = new Date(dateStr);
        return date;
      } else {
        const d = parseInt(dateStr, 10);
        const date = new Date(d);
        return date;
      }
    }
  }
  public static parseTime(timeString) {
    if (!timeString || timeString === '') {
      return null;
    }
    const time = timeString.match(this._timeReg);
    if (!time) {
      return null;
    }

    let hours = parseInt(time[1], 10);
    if (hours === 12 && !time[4]) {
      hours = 0;
    } else {
      hours += (hours < 12 && time[4]) ? 12 : 0;
    }
    const d = new Date();
    d.setHours(hours);
    d.setMinutes(parseInt(time[3], 10) || 0);
    d.setSeconds(0, 0);
    return d;
  }
  // Input is 2230 -> 22.5
  public static stringToHours(str): any {
    const natural = Math.floor(str / 100);
    const decimal = (str % 100) / 60;
    return natural + decimal;
  }

  public static formatDateString(dateString: string, format: string): string {
    if (!dateString || dateString === '') {
      return '';
    }
    const date = new Date(dateString);
    return moment(date).format(format);
  }

  /**
   * let date = new Date('2015-06-20')
   * DateUtil.formatDate(date, 'YYYY/MM/DD') -> return '2015/06/20'
   * DateUtil.formatDate(date, 'YYYY-MM-DD') -> return '2015-06-20'
   * DateUtil.formatDate(date, 'MMMM') -> return 'June'
   * DateUtil.formatDate(date, 'MMM') -> return 'Jun'
   * DateUtil.formatDate(date, 'MM') -> return '06'
   * DateUtil.formatDate(date, 'dddd') -> return 'Monday'
   * DateUtil.formatDate(date, 'ddd') -> return 'Mon'
   * DateUtil.formatDate(date, 'dd') -> return 'Mo'
   */
  public static formatDate(date, format: string): string {
    if (!date || date === '') {
      return '';
    }
    return moment(date).format(format);
    // return dateFormat(date, format, utc);
  }
  public static formatUTCDate(date, format): string {
    if (!date || date === '') {
      return '';
    }
    return moment.utc(date).format(format);
  }
  public static testDateUTC() {
    return moment.utc();
  }
  public static formatUTCDateDefault(date, format): string {
    if (!date || date === '') {
      return '';
    }
    return moment.utc(date).format();
  }
  public static reformatDate(str, format, newFormat): string {
    const date = this.parse(str, format);
    return this.formatDate(date, newFormat);
  }
  /**
   * let date = DateUtil.parse('2015-05-05', 'yyyy-MM-dd')
   */
  public static parse(str, format): Date {
    if (!str || str === '') {
      return null;
    }
    return moment(str, format).toDate();
  }
  public static dayDiff(start, end) {
    if (!start || !end) {
      return null;
    }
    return Math.floor(Math.abs((start - end) / 86400000));
  }
  public static isDate(str, format): boolean {
    /* stackoverflow.com/questions/19978953/moment-js-isvalid-function-not-doing-properly */
    return moment(str, format.toUpperCase(), true).isValid();
    /*
    if (!str || str === '') return false;
    try {
      let date = Date.parseExact(str, format);
      return true;
    } catch (e) {
      return false;
    }
    */
  }

  public static startDateOfMonth(month, year) {
    return this.createDate(year, month, 1, 0, 0, 0);
  }

  public static endDateOfMonth(month, year) {
    const lastDate = this.getLastDateOfMonth(month, year);
    const date = this.createDate(year, month, lastDate, 23, 59, 59, 59);
    return date;
  }

  public static startOfDay(date) {
    if (!date) {
      return null;
    }

    const date2 = new Date(date.toJSON());
    date2.setHours(0);
    date2.setMinutes(0);
    date2.setSeconds(0);
    return date2;
  }

  public static endOfDay(date) {
    if (!date) {
      return null;
    }

    const date2 = new Date(date.toJSON());
    date2.setHours(23);
    date2.setMinutes(59);
    date2.setSeconds(59);
    return date2;
  }
  public static addYears(date: Date, number: number) {
    // moment(date).add(number, 'years').toDate();
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + number);
    return newDate;
  }
  public static addMonths(date: Date, number: number) {
    // return moment(date).add(number, 'months').toDate();
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + number);
    return newDate;
  }
  public static addDays(date: Date, number: number) {
    // return moment(date).add(number, 'days').toDate();
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + number);
    return newDate;
  }
  public static addHours(date: Date, number: number) {
    // return moment(date).add(number, 'hours').toDate();
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + number);
    return newDate;
  }
  public static addMinutes(date: Date, number: number) {
    // return moment(date).add(number, 'minutes').toDate();
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + number);
    return newDate;
  }
  public static addSeconds(date: Date, number: number) {
    // return moment(date).add(number, 'seconds').toDate();
    const newDate = new Date(date);
    newDate.setSeconds(newDate.getSeconds() + number);
    return newDate;
  }
  public static firstDayOfMonth(date: Date): Date {
    return this.createDate(date.getFullYear(), date.getMonth() + 1, 1);
  }
  public static today(): Date {
    const now = new Date();
    const today = this.trimTime(now);
    return today;
  }
  public static now(): Date {
    return new Date();
  }
  public static compareDate(date1: Date, date2: Date): number {
    if (!date1 && !date2) {
      return 0;
    } else if (!!date1 && !date2) {
      return 1;
    } else if (!date1 && !!date2) {
      return -1;
    } else {
      const date1b = DateUtil.trimTime(date1);
      const date2b = DateUtil.trimTime(date2);
      return (date1b.getTime() - date2b.getTime());
    }
  }
  public static compareDateTime(date1, date2): number {
    if (!date1 && !date2) {
      return 0;
    } else if (!!date1 && !date2) {
      return 1;
    } else if (!date1 && !!date2) {
      return -1;
    } else {
      return (date1.getTime() - date2.getTime());
    }
  }
  public static compareTime(time1, time2, format) {
    const date1 = this.parse(time1, format);
    const date2 = this.parse(time2, format);
    return this.compareDateTime(date1, date2);
  }
  public static createDate(year: number, month: number, date: number, hour: number = 0, minute: number = 0, second: number = 0, millisecond: number = 0): Date {
    if (!millisecond) {
      millisecond = 0;
    }
    if (!second) {
      second = 0;
    }
    if (!minute) {
      minute = 0;
    }
    if (!hour) {
      hour = 0;
    }
    return new Date(year, month - 1, date, hour, minute, second, millisecond);
  }
  public static createTime(hour, minute, second, millisecond) {
    if (!millisecond) {
      millisecond = 0;
    }
    if (!second) {
      second = 0;
    }
    if (!minute) {
      minute = 0;
    }
    if (!hour) {
      hour = 0;
    }
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, second, millisecond);
  }
  public static getYear(date) {
    return date.getFullYear();
  }
  public static getMonth(date) {
    return (date.getMonth() + 1);
  }
  public static getDate(date) {
    return date.getDate();
  }
  public static getDayOfMonth(date) {
    return date.getDate();
  }
  public static getLocalYear(date) {
    // date is UTC date, original data from DB
    // return parseInt(moment(date).format('YYYY'), 10);
    return new Date(date).getFullYear();
  }
  public static getLocalMonth(date) {
    // date is UTC date, original data from DB
    // return (parseInt(moment(date).format('MM'), 10)) + 1;
    return new Date(date).getMonth() + 1;
  }
  public static getLocalDayOfMonth(date) {
    // date is UTC date, original data from DB
    // return parseInt(moment(date).format('DD'), 10);
    return new Date(date).getDate();
  }

  public static getLocalMonthText(date) {
    // date is UTC date, original data from DB
    return this.padLeft(DateUtil.getLocalMonth(date), 2, '0');
  }

  public static getLocalDayOfMonthText(date) {
    // date is UTC date, original data from DB
    return this.padLeft(DateUtil.getLocalDayOfMonth(date), 2, '0');
  }
  private static padLeft(str, length, pad: string) {
    if (!str) {
      return null;
    }
    if (str.constructor !== String) {
      str = '' + str;
    }
    if (str.length >= length) {
      return str;
    }
    if (!pad) {
      pad = ' ';
    }
    let str2 = str;
    while (str2.length < length) {
      str2 = pad + str2;
    }
    return str2;
  }
  public static getLocalDate(date) {
    // date is UTC date, original data from DB
    // return parseInt(moment(date).format('DD'), 10);
    return new Date(date).getDate();
  }
  public static getDayOfWeek(date) {
    return date.getDay();
  }
  public static getHour(date) {
    return date.getHours();
  }
  public static getMinute(date) {
    return date.getMinutes();
  }
  public static getSecond(date) {
    return date.getSeconds();
  }
  public static getMeridian(date) {
    return moment(date).format('A');
  }
  public static getHours(date) {
    // return moment(date).format('hh');
    const hour = new Date(date).getHours();
    return hour !== 0 ? this.padLeft(hour, 2, '0') : '12' ;
  }
  public static getMinutes(date) {
    // return moment(date).format('mm');
    const minutes = new Date(date).getMinutes();
    return minutes !== 0 ? this.padLeft(minutes, 2, '0') : '00';
  }
  public static getMaxDate(date1: Date, date2: Date, date3?: Date, date4?: Date, date5?: Date) {
    const max1 = ((date1.getTime() > date2.getTime()) ? date1 : date2);
    if (!date3) {
      return max1;
    }
    const max2 = ((max1.getTime() > date3.getTime()) ? max1 : date3);
    if (!date4) {
      return max2;
    }
    const max3 = ((max2.getTime() > date4.getTime()) ? max2 : date4);
    if (!date5) {
      return max3;
    }
    const max4 = ((max3.getTime() > date5.getTime()) ? max3 : date5);
    return max4;
  }
  public static getMinDate(date1: Date, date2: Date, date3?: Date, date4?: Date, date5?: Date) {
    const min1 = ((date1.getTime() < date2.getTime()) ? date1 : date2);
    if (!date3) {
      return min1;
    }
    const min2 = ((min1.getTime() < date3.getTime()) ? min1 : date3);
    if (!date4) {
      return min2;
    }
    const min3 = ((min2.getTime() < date4.getTime()) ? min2 : date4);
    if (!date5) {
      return min3;
    }
    const min4 = ((min3.getTime() < date5.getTime()) ? min3 : date5);
    return min4;
  }
  public static trimTime(date) {
    if (!date) {
      return null;
    }
    return this.createDate(date.getFullYear(), date.getMonth(), date.getDate());
  }
  public static trimSecond(date) {
    if (!date) {
      return null;
    }
    return this.createDate(date.getFullYear(), date.getMonth(), date.getDay(), date.getHours(), date.getMinutes(), 0, 0);
  }
  public static trimMillisecond(date) {
    if (!date) {
      return null;
    }
    return this.createDate(date.getFullYear(), date.getMonth(), date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);
  }
  public static concat(array1, array2, index) {
    return array1.concat(array2.slice(index));
  }
  public static getBetweenMiliSeconds(date1, date2) {
    if (typeof (date1) !== typeof (date2)) {
      return -1;
    }
    return Math.abs(date2 - date1);
  }
  public static getMinutesBetween(date1, date2) {
    if (typeof (date1) !== typeof (date2)) {
      return -1;
    }
    return Math.abs(date2 - date1) / 60000;
  }
  public static getHoursBetween(date1, date2) {
    if (typeof (date1) !== typeof (date2)) {
      return -1;
    }
    return Math.abs(date2 - date1) / 3600000;
  }
  public static getDaysInMonth(month, year) {
    const date = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = 1; i <= date; i++) {
      days.push(i);
    }
    return days;
  }
  public static getYears() {
    return [2010, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  }
  public static getShortFormMonths() {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  }
  public static getMonthsInYear() {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i.toString());
    }
    return months;
  }
  public static getMonthsOfYear() {
    const months = [
      { value: '1', text: 'Jan' },
      { value: '2', text: 'Feb' },
      { value: '3', text: 'Mar' },
      { value: '4', text: 'Apr' },
      { value: '5', text: 'May' },
      { value: '6', text: 'June' },
      { value: '7', text: 'July' },
      { value: '8', text: 'Aug' },
      { value: '9', text: 'Sept' },
      { value: '10', text: 'Oct' },
      { value: '11', text: 'Nov' },
      { value: '12', text: 'Dec' }
    ];
    return months;
  }
  public static convertDateTimeToString(date) {
    // return UTC date
    return date.toISOString(); // Returns 2011-10-05T14:48:00.000Z
  }
  public static time5toTime4(str) {
    if (!str || str.length !== 5) {
      return str;
    }
    return str.replace(':', '');
  }
  public static time4toTime5(str) {
    if (!str || str.length !== 4) {
      return str;
    }
    return str.substring(0, 2) + ':' + str.substring(2);
  }
  public static getHourTextFromTime4(str) {
    if (str.length === 3) {
      return str.substring(0, 1);
    }
    return str.substring(0, 2);
  }
  public static getHourFromTime4(str) {
    if (str.length === 3) {
      return str.substring(0, 1);
    }
    return parseInt(str.substring(0, 2), 10);
  }
  public static getMinFromTime4(str) {
    if (str.length === 3) {
      return str.substring(1, 2);
    }
    return parseInt(str.substring(2, 4), 10);
  }

  public static getHourTextFromTime5(str) {
    const res = str.split(':');
    return res[0];
  }
  public static getHourFromTime5(str) {
    const res = str.split(':');
    return parseInt(res[0], 10);
  }
  public static getMinuteTextFromTime5(str) {
    const res = str.split(':');
    return res[1];
  }
  public static getMinuteFromTime5(str) {
    const res = str.split(':');
    return parseInt(res[1], 10);
  }
  public static formatHour(str) {
    if (!str || str.length !== 4) {
      return str;
    }
    return str.substring(0, 2) + ':' + str.substring(2, 4);
  }
  public static formatHourAmPm(str) {
    if (!str || str.length !== 4) {
      return str;
    }
    const hour = parseInt(str.substring(0, 2), 10);
    if (hour < 12) {
      return hour + ':' + str.substring(2, 4) + ' AM';
    } else {
      return (hour - 12) + ':' + str.substring(2, 4) + ' PM';
    }
  }
  public static formatTimeString(time) {
    if (time.length === 4) {
      time = '0' + time;
    }
    return time.replace(':', '');
  }

  public static formatCalendarString(time) {
    let i = 2;
    while (i > 0) {
      time = time.replace('-', '');
      i--;
    }
    return time;
  }
  public static formatNumberToString(intNumber) {
    let str = null;
    try {
      str = intNumber.toString();
      if ((str.length < 2) || (str.length === 4 && str.indexOf(':') >= 0)) {
        str = '0' + str;
      }
    } catch (e) {
    }
    return str;
  }
  public static setNextQuarter(hour, minute) {
    if (minute <= 15) {
      minute = 15;
    }
    if (15 < minute && minute <= 30) {
      minute = 30;
    } // minute <=45
    if (30 < minute && minute <= 45) {
      minute = 45;

    }
    if (45 < minute) {
      minute = '00';
      if (hour < 23) {
        hour++;
      } else {
        hour = '00';
      }
    }
    return hour + '' + minute;
  }
  public static getLastDateOfMonth(month, year) {
    if (!year) {
      const t = new Date();
      year = t.getFullYear();
    }
    const d = new Date(year, month, 0);
    return d.getDate();
  }
  public static isBetween(date, minDate, maxDate) {
    // return moment(date).isBetween(minDate, maxDate);
    // Date.parse() returns the number of milliseconds since January 1, 1970, 00:00:00 UTC
    const parseDate =  Date.parse(date);
    return Date.parse(minDate) < parseDate && parseDate < Date.parse(maxDate);
  }
  // diffType: 'days' | 'years' | 'months' | 'seconds'
  public static diff(firstDate, secondDate, month, year, diffType) {
    firstDate = moment([year, month, firstDate]);
    secondDate = moment([year, month, secondDate]);
    return secondDate.diff(firstDate, diffType);
  }
  public static diffDate(firstDate, secondDate, diffType) {
    firstDate = moment(firstDate);
    secondDate = moment(secondDate);
    return secondDate.diff(firstDate, diffType);
  }
  public static parseToTime24(hours, minutes, meridian) {
    if (meridian === 'AM') {
      if (hours === 12) {
        hours = 0;
      }
    } else {
      if (hours === 12) {
        hours = 12;
      } else {
        hours = this.toInt(hours) + 12;
      }
    }
    return hours + ':' + minutes;
  }
  public static parseToHour24(hours, meridian) {
    let hoursInt: number = parseInt(hours, 10);
    if (meridian === 'PM' && hoursInt < 12) {
      hoursInt = hoursInt + 12;
    }
    if (meridian === 'AM' && hoursInt === 12) {
      hoursInt = hoursInt - 12;
    }
    return hoursInt;
  }
  public static parseToTime12(hours, minutes, meridian) {
    if (meridian === 'AM') {
      if (hours === 12) {
        hours = 0;
      }
    } else {
      if (hours > 12) {
        hours = this.toInt(hours) - 12;
      }
    }

    return hours + ':' + minutes;
  }
  private static toInt(value): number {
    if (!value || value === '') {
      return 0;
    }
    if (isNaN(value)) {
      return 0;
    }
    return parseInt(value, 10);
  }
  public static lastDateOfCurrentMonth(format) {
    const now = new Date();
    const lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return this.formatDate(lastDate, format);
  }
  public static firstDateOfCurrentMonth(currentDate, format) {
    const date = new Date(currentDate);
    date.setDate(1);
    // const firstDate = this.createDate(date.getFullYear(), date.getMonth() + 1, 1);
    return this.formatDate(date, format);
  }
  public static firstDayInPreviousMonth(currentDate, format) {
    const date = new Date(currentDate);
    date.setDate(1);
    date.setMonth(date.getMonth() - 1);
    return this.formatDate(date, format);
  }
  public static priorMonthOnSameCurrent(currentDate, format) {
    return moment(currentDate).subtract(1, 'months').format(format);
  }

  public static dayPriorCurrentDate(number, format) {
    const date = moment().subtract(number, 'days');
    return this.formatDate(date, format);
  }
  public static getPastDay(date, dayNumber) {
    if (!date) {
      return null;
    }
    const cloneDate = new Date(date);
    cloneDate.setDate(cloneDate.getDate() - parseInt(dayNumber, null));
    return cloneDate;
  }
  public static getPastMonth(date, number) {
    if (!date) {
      return null;
    }
    const cloneDate = new Date(date);
    cloneDate.setMonth(cloneDate.getMonth() - parseInt(number, null));
    return cloneDate;
  }
  public static getFirstDateOfMonth(date) {
    if (!date) {
      return null;
    }
    const cloneDate = new Date(date);
    cloneDate.setDate(1);
    return cloneDate;
  }
  public static getLastDateOfMonthByDate(date) {
    if (!date) {
      return null;
    }
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  }

  public static parseTimestamp = (str) => {
    try {
      const y = str.substring(0, 4),
        m = str.substring(4, 6),
        d = str.substring(6, 8),
        hh = str.substring(8, 10),
        mm = str.substring(10, 12),
        ss = str.substring(12, 14);
      return `${d}/${m}/${y} ${hh}:${mm}:${ss}`;
    } catch (e) {
      return 'Invalid date';
    }
  }
}
