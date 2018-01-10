import moment from 'moment';
import {StorageKey} from './constants/Code';
import {DateFormat} from './constants/Date';
export default class Storage{
  static isExist(key){
    if(typeof key !== 'string'){
      return false;
    }
    return localStorage.hasOwnProperty(key);
  }

  static get(key){
    if (this.isExist(key) && '' !== localStorage[key]){
      let target = localStorage[key];
      if (target.length > 2 && (target[0] === '{' || target[0] === '[')) {
        return JSON.parse(localStorage[key])
      }
      return localStorage[key];
    } else {
      return false;
    }
  }

  static set(key, value){
    if (typeof key !== 'string' || !value) {
      return false;
    }
    if (typeof value !== 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  static deleteItem(key){
    if (typeof key !== 'string'){
      return false;
    }
    localStorage.removeItem(key);
  }
  
  //Token만
  static getToken(){
    if (sessionStorage.hasOwnProperty(StorageKey.AUTH_TOKENNAME) === true && sessionStorage.getItem(StorageKey.AUTH_TOKENNAME) !== '') {
      return sessionStorage.getItem(StorageKey.AUTH_TOKENNAME);
    }
    if (localStorage.hasOwnProperty(StorageKey.AUTH_TOKENNAME) === true && localStorage.getItem(StorageKey.AUTH_TOKENNAME) !== '') {
      return localStorage.getItem(StorageKey.AUTH_TOKENNAME);
    } else {
      return false;
    }
  }

  static hasToken() {
    if (sessionStorage.hasOwnProperty(StorageKey.AUTH_TOKENNAME)) {
      return true;
    }
  }

  static setToken(token){
    if (token) {
      localStorage.setItem(StorageKey.AUTH_TOKENNAME, token);
    }
  }

  static setStudentId(studentId) {
    localStorage.setItem(StorageKey.STUDENT_ACTORID, studentId);
  }

  static getStudentId() {
    return localStorage.getItem(StorageKey.STUDENT_ACTORID);
  }

  static removeStudentId() {
    localStorage.removeItem(StorageKey.STUDENT_ACTORID);
  }

  static setFamilyId(familyId) {
    localStorage.setItem(StorageKey.FAMILY_OWNERID, familyId);
  }

  static removeFamilyId() {
    localStorage.removeItem(StorageKey.FAMILY_OWNERID);
  }

  static getFamilyId() {
    return localStorage.getItem(StorageKey.FAMILY_OWNERID);
  }

  static setLoginToken(token) {
    if(token){
      sessionStorage.setItem(StorageKey.AUTH_TOKENNAME, token);
    }
  }

  static deleteToken(){
    localStorage.removeItem(StorageKey.AUTH_TOKENNAME);
  }
  
  static logout(){
    localStorage.removeItem(StorageKey.AUTH_TOKENNAME);
    localStorage.removeItem(StorageKey.STUDENT_ACTORID);
    localStorage.removeItem(StorageKey.FAMILY_OWNERID);
    sessionStorage.removeItem(StorageKey.AUTH_TOKENNAME);
  }



  // 학생앱 //
  static setTokenForStudentApp(token) {
    localStorage.setItem(StorageKey.STUDENTAPP_AUTH_TOKENNAME, token);
  }

  static getTokenForStudentApp(){
    return localStorage.getItem(StorageKey.STUDENTAPP_AUTH_TOKENNAME);
  }

  static hasTokenForStudentApp() {
    if (localStorage.getItem(StorageKey.STUDENTAPP_AUTH_TOKENNAME)) {
      return true;
    }
    return false;
  }

  static setStudentActorIdForStudentApp(studentActorId) {
    localStorage.setItem(StorageKey.STUDENTAPP_STUDENT_ACTORID, studentActorId);
  }

  static getStudentActorIdForStudentApp() {
    const studentActorId = localStorage.getItem(StorageKey.STUDENTAPP_STUDENT_ACTORID);
    return studentActorId ? parseInt(studentActorId, 10) : studentActorId;
  }

  static removeStudentActorIdForStudentApp() {
    localStorage.removeItem(StorageKey.STUDENTAPP_STUDENT_ACTORID);
  }

  static setFamilyActorIdForStudentApp(familyId) {
    localStorage.setItem(StorageKey.STUDENTAPP_FAMILY_OWNERID, familyId);
  }

  static getFamilyActorIdForStudentApp() {
    const familyActorId = localStorage.getItem(StorageKey.STUDENTAPP_FAMILY_OWNERID);
    return familyActorId ? parseInt(familyActorId, 10) : familyActorId;
  }

  static removeFamilyActorIdForStudentApp() {
    localStorage.removeItem(StorageKey.STUDENTAPP_FAMILY_OWNERID);
  }



  static setStudentFirstLoginForStudentApp(studentActorId, date) {
    localStorage.setItem(StorageKey.STUDENTAPP_FIRSTLOGIN(studentActorId), date);
  }

  static isStudentFirstLoginForStudentApp(studentActorId) {
    if (localStorage.hasOwnProperty(StorageKey.STUDENTAPP_FIRSTLOGIN(studentActorId))) {
      return true;
    }
    return false;
  }

  static setStudyInfomationForStudentApp(studentActorId, date) {
    localStorage.setItem(StorageKey.STUDENTAPP_STUDYINFO_POPUP(studentActorId), moment(date).format(DateFormat.half));
  }

  static isStudyInfomationForStudentApp(studentActorId, date) {
    let infoDate = localStorage.getItem(StorageKey.STUDENTAPP_STUDYINFO_POPUP(studentActorId));
    const firstLogin = localStorage.getItem(StorageKey.STUDENTAPP_FIRSTLOGIN(studentActorId));
    if (!infoDate) {
      Storage.setStudyInfomationForStudentApp(studentActorId, date);
      if (!firstLogin) {
        return true;
      }
      if (moment(date, DateFormat.half).diff(moment(firstLogin, DateFormat.half), 'days') <= 7) {
        return true;
      }
      return false;
    }

    if (moment(infoDate, DateFormat.half).isSame(moment(date, DateFormat.half)) === true) {
      return false;
    } else {
      Storage.setStudyInfomationForStudentApp(studentActorId, date);
      infoDate = date;
    }

    if (moment(infoDate, DateFormat.half).diff(moment(firstLogin, DateFormat.half), 'days') <= 7 ) {
      return true;
    }
    return false;
  }

  static setStudentAttedanceForStudentApp(studentActorId, date) {
    localStorage.setItem(StorageKey.STUDENTAPP_ATTENDANCE(studentActorId), date);
  }
  
  static isStudentAttendanceForStudentApp(studentActorId, date) {
    const attendanceDate = localStorage.getItem(StorageKey.STUDENTAPP_ATTENDANCE(studentActorId));
    if (attendanceDate && attendanceDate === date) {
      return true;
    }
    return false;
  }

  static setTodayStudyForStudentApp(studentActorId, date) {
    localStorage.setItem(StorageKey.STUDENTAPP_TODAYSTUDY(studentActorId), date);
  }

  static isTodayStudyForStudentApp(studentActorId, date) {
    const attendanceDate = localStorage.getItem(StorageKey.STUDENTAPP_TODAYSTUDY(studentActorId));
    if (attendanceDate && attendanceDate === date) {
      return true;
    }
    return false;
  }

  static getRequestStudyForStudentApp(studentActorId) {
    const requestDate = localStorage.getItem(StorageKey.STUDENTAPP_REQUEST_STUDY(studentActorId));
    return requestDate ? requestDate : '';
  }

  static setRequestStudyForStudentApp(studentActorId, date) {
    localStorage.setItem(StorageKey.STUDENTAPP_REQUEST_STUDY(studentActorId), date);
  }

  static getStudyLimitTime(studentActorId, date) {
    const limitTime = localStorage.getItem(StorageKey.STUDENTAPP_STUDY_LIMIT_TIME(studentActorId))
    if (limitTime) {
      const info = JSON.parse(limitTime);
      if (info.date === date) {
        return info;
      } else {
        return {
          date,
          second: 0,
          minute: 0
        };
      }
    } else {
      return {
        date,
        second: 0,
        minute: 0
      };
    }
  }

  static setStudyLimitTime(studentActorId, date, second) {
    const key = StorageKey.STUDENTAPP_STUDY_LIMIT_TIME(studentActorId);

    localStorage.setItem(key, JSON.stringify({
      date: date,
      second: second,
      minute: parseInt(second / 60, 10)
    }));
  }
}