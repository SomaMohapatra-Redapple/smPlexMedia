const moment = require('moment')
const momenttz = require('moment-timezone')
const timeZone = process.env.TIME_ZONE
const timeZoneKst = process.env.TIME_ZONE_KST


let now = () => {
  // return moment.utc().unix();
  return moment.utc().format();
}
let utc = () => {
  return momenttz().tz(timeZone).utc().unix();
}

let kst = () => {
  return momenttz().tz(timeZone).unix();
}

let kstDatetime = () => {
  return momenttz().tz(timeZoneKst).format('YYYY-MM-DD HH:mm:ss.SSS');
}
let kstDate = () => {
  return momenttz().tz(timeZoneKst).format('YYYY-MM-DD');
}

let getLocalTime = () => {
  return moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss.SSS');
}

let getCurrentTimeStamp = () => {
  return moment().tz(timeZone).unix();
}

let convertToLocalTime = (time) => {
  return momenttz.tz(time, timeZone).format('YYYY-MM-DD HH:mm:ss')
}

let calculateTime = (diff) => {
  const diffDuration = moment.duration(diff);
  return {
    days: diffDuration.days(),
    hours: diffDuration.hours(),
    minutes: diffDuration.minutes(),
    seconds: diffDuration.seconds()
  }
}

let calculateTimeDiff = (firstdatetime, seconddatetime) => {
  const diff = moment(seconddatetime, "DD/MM/YYYY HH:mm:ss").diff(moment(firstdatetime, "DD/MM/YYYY HH:mm:ss"));
  return diff;
}

let calculateExpTime = (time) => {
  let finaldatetime = moment().add(time, 's');
  return convertToLocalTime(finaldatetime);
}

let calculateTrackerTime = (input) => {
  let initialdatetime = moment(getLocalTime());
  let finaldatetime = moment(input);
  console.log(`input : ${input} initialdatetime : ${initialdatetime} finaldatetime : ${finaldatetime}`);
  let counter = finaldatetime.diff(initialdatetime, 'seconds');
  return counter;
}

let checkExpTime = (time) => {
  let diff = moment.tz(time, timeZone).unix() - moment().tz(timeZone).unix();
  if (diff > 0) {
    return true;
  } else {
    return false;
  }
}


let currentTimeStamp = () => {
  return moment.utc().unix();
}

let currentDayStart = () => {
  return moment.utc().startOf('day').unix();
}
let convertToTimeStamp = (time) => {
  return moment(time).utc().unix()
}

let convertToTimeStampKST = (time) => {
  return momenttz.tz(time, timeZoneKst).unix();
}

let getDay = (time) => {
  return moment(time).tz(timeZone).day();
}

let convertToLocalDate = (time) => {
  return momenttz.tz(time, timeZone).format('YYYY-MM-DD')
}

let formatDate = (date) => {
  return moment(date).utc().format('DD-MM-YYYY HH:mm:ss')
}

let formatDateTime = (datetime,format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment.utc(datetime).format(format);
}

let formatDateTimeISO = (datetime) => {
  return moment.utc(datetime).toDate();
}

let currentDateTime = () => {
  return moment().format('DD/MM/YYYY HH:mm:ss')
}

let currentDate = () => {
  return moment.utc().format('YYYY-MM-DD');
}

let dateFormat = (datetime) => {
  return moment(datetime).format('DD/MM/YYYY HH:mm:ss')
}

let twentyFourHoursTimeFormat = (time) => {
  let momentObj = moment(time, ["h:mm A"]);
  //  console.log(momentObj.format("HH:mm:ss"));
  return momentObj.format("HH:mm:ss")
}

let addTime = (extratime) => {
  let oldDateObj = moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
  let newDateObj = moment(oldDateObj).add(extratime, 'm').toDate();
  return newDateObj;
}

let dateFormatMonth = (datetime) => {

  let newdatetime = (datetime !='')?datetime:this.currentDateTime
  return moment(newdatetime).format('DD MMMM,YYYY, HH:mm:ss')
}

module.exports = {
  now: now,
  utc: utc,
  getLocalTime: getLocalTime,
  convertToLocalTime: convertToLocalTime,
  calculateTime: calculateTime,
  calculateExpTime: calculateExpTime,
  calculateTimeDiff: calculateTimeDiff,
  calculateTrackerTime: calculateTrackerTime,
  checkExpTime: checkExpTime,
  getCurrentTimeStamp: getCurrentTimeStamp,
  convertToLocalTime: convertToLocalTime,
  formatDate: formatDate,
  formatDateTime: formatDateTime,
  currentDateTime: currentDateTime,
  dateFormat: dateFormat,
  twentyFourHoursTimeFormat: twentyFourHoursTimeFormat,
  convertToLocalDate: convertToLocalDate,
  currentDayStart: currentDayStart,
  currentTimeStamp: currentTimeStamp,
  convertToTimeStamp: convertToTimeStamp,
  getDay: getDay,
  addTime: addTime,
  currentDate: currentDate,
  kstDatetime: kstDatetime,
  kstDate: kstDate,
  kst: kst,
  dateFormatMonth:dateFormatMonth,
  formatDateTimeISO:formatDateTimeISO,
  convertToTimeStampKST:convertToTimeStampKST
}