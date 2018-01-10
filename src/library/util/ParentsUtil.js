import moment from 'moment';
import {RegExp} from '../constants/RegExp';
import {
  MaleName, ModelStatus, ReverseModelStatus, StudentSubject, SubjectCodeToLabel, MaleDefaultImg, WorkType, 
  MailFaceImage, ItemMiddleCategoryTagName, MembershipName, MembershipDetailName} from '../constants/Code';

//주로 판단할때 사용합니다.
class ParentsUtil {
  //안심번호인지 체크합니다. (앞자리 0505)
  static isReliefNumber(number){
    if('string' !== typeof number){
      return false;
    }
    let modifyNumber = number.replace(/-/g,'');
    let slicedNumber = modifyNumber.slice(0, 4);
    if('0505' === slicedNumber){
      return true;
    }
    return false
  }
  
  static validatePhoneNumber(number){
    let stringNumber = number.toString();
    let modifyNumber = stringNumber.replace(/-/g,'');
    let slicedNumber = modifyNumber.slice(0, 4);
    if('0505' === slicedNumber || number.length === 12){
      return true;
    }
    if(RegExp.PHONE.test(stringNumber)){
      return true;
    }
    return false;
  }

  //student생일을 넣으면 나이를 반환합니다.
  static getAge(userBirthday){
    let now = moment().format('YYYY-01-01');
    let birthday = moment(userBirthday).add(-1, 'years').format('YYYY-01-01');
    let years = moment(now).diff(moment(birthday), 'years');
    return years;
  }

  //getStudentAge
  static getActorAge(actorInfo) {
    if (actorInfo && actorInfo.auth_detail && actorInfo.auth_detail.birthday) {
      return ParentsUtil.getAge(actorInfo.auth_detail.birthday);
    }
    return 0;
  }

  //3세일경우 4세로 반환됩니다.
  static getTransformActorAge(actorInfo) {
    if (actorInfo && actorInfo.auth_detail && actorInfo.auth_detail.birthday) {
      const age = ParentsUtil.getAge(actorInfo.auth_detail.birthday)
      return age === 3 ? 4 : age;
    }
    return 0;
  }

  //getStudentBirthday
  static getActorBirthday(actorInfo, dateFormat='YYYY.MM.DD') {
    if (actorInfo && actorInfo.auth_detail && actorInfo.auth_detail.birthday) {
      if (dateFormat !== '') {
        return moment(actorInfo.auth_detail.birthday).format(dateFormat);
      } else {
        return actorInfo.auth_detail.birthday;
      }
    }
    return '';
  }

  //isStudentMale
  static isActorMale(actorInfo, defaultValue = false) {
    if (actorInfo && actorInfo.auth_detail) {
      return actorInfo.auth_detail.is_male;
    }
    return defaultValue;
  }

  static getActorServiceStartDate(actorInfo, defaultValue = '') {
    if (actorInfo.service_start_date) {
      return moment(actorInfo.service_start_date).format('YYYY.MM.DD')
    }
    return defaultValue;
  }

  static getActorServiceLimitDate(actorInfo, defaultValue = '') {
    if (actorInfo.service_limit_date) {
      return moment(actorInfo.service_limit_date).format('YYYY.MM.DD')
    }
    return defaultValue;
  }

  static isActorService(actorInfo) {
    let studentSubjectCode = ParentsUtil.getStudentCurrentSubjectCode(actorInfo);
    return studentSubjectCode !== 0;
  }

  static getActorProfileImageURL(actorInfo, defaultImage = false) {
    if (actorInfo && actorInfo.data && actorInfo.data.profile_image_url) {
      return actorInfo.data.profile_image_url;
    }

    if (defaultImage === true) {
      return ParentsUtil.getActorDefaultProfileImage(actorInfo);
    }
    return '';
  }

  static getActorDefaultProfileImage(actorInfo) {
    return MaleDefaultImg[ParentsUtil.isActorMale(actorInfo)];
  }

  //getStudentFaceImage
  static getActorFaceImage(actorInfo) {
    let profile_image_url = ParentsUtil.getActorProfileImageURL(actorInfo);
    const isMale = ParentsUtil.isActorMale(actorInfo);
    return profile_image_url ? profile_image_url : MailFaceImage[isMale];
  }

  //getStudentHumanName
  static getActorHumanName(actorInfo) {
    if (actorInfo && actorInfo.auth_detail && actorInfo.auth_detail.human_name) {
      return actorInfo.auth_detail.human_name;
    }
    return '';
  }

  static getActorMDN(actorInfo) {
    if (actorInfo && actorInfo.auth_detail && actorInfo.auth_detail.human_mdn) {
      return actorInfo.auth_detail.human_mdn;
    }
    return '';
  }

  //isMale
  //getStudentMaleName
  static getActorMaleName(actorInfo){
    const isMale = ParentsUtil.isActorMale(actorInfo)
    return MaleName[isMale]
  }

  static getAuthHumanName(authInfo) {
    if (authInfo && authInfo.human_name) {
      return authInfo.human_name;
    }
    return '';
  }

  static isMale(studentInfo){
    if (studentInfo && studentInfo.auth_detail) {
      return MaleName[studentInfo.auth_detail.is_male]
    } else {
      return MaleName[true]
    }
  }

  static getStudyStatus(student){
    if(!student.service_limit_date){
      if(student.status === ModelStatus.체험대기회원){
        return '체험 대기중'
      } else if (student.status === ModelStatus.유료회원) {
        return '학습 대기중'
      } else {
        return '미학습';
      }
    } else if(moment().isAfter(student.service_limit_date)){
      //학습시간이 끝난 상태
      return '학습종료';
    }  else {
      //적어도 한개는 학습중
      return ParentsUtil._getStringStudyStatus(student);
    }
  }

  //학생의 학습상태를 스트링값으로 반환됩니다.
  static _getStringStudyStatus(student){
    let statusArr = [];
    let status = '';
    let age = ParentsUtil.getActorAge(student);

    if(student.service_limit_date_KM){
      if(moment(student.service_limit_date_KM).isAfter()){
        if(age > 6){
          statusArr.push('국어, 수학');
        } else {
          statusArr.push('한글, 수학');
        }
      }
    }

    if(student.service_limit_date_E){
      if(moment(student.service_limit_date_E).isAfter()){
        statusArr.push('영어');
      }
    }

    statusArr.forEach((item, index)=>{
      status += item;
      if((statusArr.length-1) !== index){
        status += ', ';
      }
    })

    if(0 !== statusArr.length){
      status += ' 학습중';
    }

    return status;
  }

  static getSubjectName(studentInfo, name) {
    let age = ParentsUtil.getActorAge(studentInfo);
    if (age > 6 && name === '한글') {
      return '국어';
    } else if (name === '한글') {
      return '한글'
    } else if (name === '스토리영어') {
      return '스토리 영어'
    } else if (name === '개념국어') {
      return '개념 국어'
    } else if (name === '개념수학') {
      return '개념 수학'
    } else if (name === '교과국어') {
      return '교과 국어'
    } else if (name === '교과수학') {
      return '교과 수학'
    }
    return name;
  }

  static getSubjectFullName(studentInfo, name) {
    let age = ParentsUtil.getActorAge(studentInfo);
    if (age > 6 && name === '한글') {
      return '영역별 국어';
    } else if (name === '한글') {
      return '단계별 한글'
    } else if (name === '수학') {
      return '영역별 수학'
    } else if (name === '스토리영어') {
      return '스토리 영어'
    } else if (name === '개념국어') {
      return '개념 국어'
    } else if (name === '개념수학') {
      return '개념 수학'
    } else if (name === '교과국어') {
      return '교과 국어'
    } else if (name === '교과수학') {
      return '교과 수학'
    }

    return name;
  }

  static getSubjectCodeByInfo(info){
    if(info && info.subject_tag_name === "한글・수학"){
      return StudentSubject.StudentSubjectKorMath;
    } else if(info && info.subject_tag_name === "영어"){
      return StudentSubject.StudentSubjectEng;
    } else{
      return StudentSubject.StudentSubjectTotal
    }
  }

  static getStudentCurrentSubjectCode(student, nowDate = moment()){
    //service_limit_date 는 최초 null 
    //체험학습 또는 단과수업을 들으면 service_limit_date 가 설정이 되고 이후 수업을 재등록 하지 않는 이상 service_limit_date는 변하지 않는다
    //그래서 .isAfter를 체크한다.
    let serviceLimitDateKM = student.service_limit_date_KM ? (nowDate.isAfter(student.service_limit_date_KM) ? false : true) : false
    let serviceLimitDateE = student.service_limit_date_E ? (nowDate.isAfter(student.service_limit_date_E) ? false : true) : false

    if (student.status >= ModelStatus.종료회원) {
      return StudentSubject.StudentSubjectNone;
    }

    if(serviceLimitDateKM && serviceLimitDateE){
      return StudentSubject.StudentSubjectTotal;
    } else {
      if(serviceLimitDateKM && !serviceLimitDateE){
        return StudentSubject.StudentSubjectKorMath;
      } else if(!serviceLimitDateKM && serviceLimitDateE){
        return StudentSubject.StudentSubjectEng;
      } else {
        return StudentSubject.StudentSubjectNone;
      }
    }
  }

  static getStudentNonLearningSubjectName(studentInfo, nowDate) {
    let subjectName = '';
    if (ParentsUtil.getStudentCurrentSubjectCode(studentInfo, moment(nowDate)) === StudentSubject.StudentSubjectKorMath) {
			subjectName = ParentsUtil.getSubjectName(studentInfo, '영어');
		} else {
      subjectName = ParentsUtil.getSubjectName(studentInfo, '한글') + ' 수학';
    }
    return subjectName;
  }

  static getMembershipString(studentInfo){
    const status = ParentsUtil.getStudentModelStatus(studentInfo);
    if (status) {
      if(status === ModelStatus.Removed){
        return MembershipName.삭제회원;
      } else if(status === ModelStatus.Hided){
        return MembershipName.탈퇴회원;
      } else if(status === ModelStatus.Sleeping){
        return MembershipName.휴면회원;
      } else if(status >= 100 && status < 110){
        return MembershipName.준회원;
      } else if(status >= 110 && status < 120){
        return MembershipName.체험회원;
      } else if(status >= 120 && status < 130){
        return MembershipName.정회원;
      } else if(status >= 130 && status < 140){
        return MembershipName.종료회원;
      } else {
        // console.exception('getMembershipString - actorStatus', actorStatus);
        new Error('getMembershipString - actorStatus')
      }
    } else {
      return null;
    }
  }
  
  static getMembershipDetailString(studentInfo){
    const status = ParentsUtil.getStudentModelStatus(studentInfo);
    if (status) {
      if (status === ModelStatus.Removed){
        return MembershipDetailName.삭제회원;
      } else if(status === ModelStatus.Hided){
        return MembershipDetailName.탈퇴회원;
      } else if(status === ModelStatus.Sleeping){
        return MembershipDetailName.휴면회원;
      } else if( status >= 100 && status < 110) {
        return ReverseModelStatus[status] ? ReverseModelStatus[status] : '준회원';
      } else if(status >= 110 && status < 120){
        return ReverseModelStatus[status] ? ReverseModelStatus[status] : '체험회원';
      } else if(status >= 120 && status < 130){
        return ReverseModelStatus[status] ? ReverseModelStatus[status] : '정회원';
      } else if(status >= 130 && status < 140){
        return ReverseModelStatus[status] ? ReverseModelStatus[status] : '종료회원';
      } else {
        // console.exception('getMembershipDetailString - actorStatus', actorStatus);
        new Error('getMembershipDetailString - actorStatus')
      }
    } else {
      return null;
    }
  }


  static canExperience(studentInfo) {
    const membershipName = ParentsUtil.getMembershipString(studentInfo);
    const membershipDetailName = ParentsUtil.getMembershipDetailString(studentInfo);
    if(ParentsUtil.isCSRExperienceExaminationWork(studentInfo) === true){
      return false;
    }
    if (membershipName === MembershipDetailName.준회원) {
      return true;
    }

    if (membershipDetailName === MembershipDetailName.체험학습종료) {
      return true;
    }

    return false;
  }

  static canChargedMember(studentInfo) {
    return true;
  }


  static isDelivering(studentInfo) {
    const workType = ParentsUtil.getStudentCurrentWorkType(studentInfo)
    if (workType === WorkType.CSROnServiceWork) {
      return false;
    }
    if (workType === WorkType.CSRCheckServiceWork) {
      return false;
    }
    if (workType === WorkType.CSRWaitStopServiceWork) {
      return false;
    }
    return true;
  }

  static isStopServie(studentInfo) {
    const membershipName = ParentsUtil.getMembershipString(studentInfo);
    if (membershipName === MembershipName.종료회원) {
      return true;
    }
    return false;
  }

  static isStuding(studentInfo) {
    const membershipName = ParentsUtil.getMembershipString(studentInfo);
    if (membershipName === MembershipName.체험회원 || membershipName === MembershipName.정회원) {
      return true;
    }
    return false;
  }

  static isSampleView(studentInfo) {
    if (studentInfo) {
      let membershipName = ParentsUtil.getMembershipString(studentInfo);
      if(membershipName === MembershipName.준회원 || membershipName === MembershipName.종료회원){
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  static getStudentModelStatus(studentInfo) {
    if (!studentInfo) {
      return null;
    }

    if (studentInfo.status === ModelStatus.체험중회원) {
      const code = ParentsUtil.getStudentCurrentSubjectCode(studentInfo);
      if (code === StudentSubject.StudentSubjectNone) {
        return ModelStatus.체험학습종료;
      }
      return ModelStatus.체험중회원;
    }
    if (
      studentInfo.status === ModelStatus.유료회원 
      || studentInfo.status === ModelStatus.휴지회원
      || studentInfo.status === ModelStatus['무료(무결제)회원']
    ) {
      if (studentInfo.service_limit_date) {
        const code = ParentsUtil.getStudentCurrentSubjectCode(studentInfo);
        if (code === StudentSubject.StudentSubjectNone) {
          return ModelStatus.유료학습종료;
        }
        return ModelStatus.유료회원;
      }
      return studentInfo.status;
    }
    return studentInfo.status;
  }

  static getBenefitDate(student){
    let benefitDate = moment().add(1, 'months').format('YYYY.MM.DD');
    if (student.service_start_date) {
      benefitDate = moment(student.service_start_date).add(1, 'months').format('YYYY.MM.DD')
    }

    return benefitDate;
  }

  static getSubjectStatusInfo(student, studentSubjectCode){
    let isSubject = studentSubjectCode !== 0
    if(isSubject){
      return SubjectCodeToLabel[studentSubjectCode]
    } else {
      if(ReverseModelStatus[student.status] === '체험학습종료'){
        return '체험 학습 종료'
      } else if(ReverseModelStatus[student.status] === '유료학습종료'){
        return '학습종료'
      } else {
        return '학습 정보가 없습니다.'
      }
    }
  }

  static getFindStudentInfoOfStudentList(students, studentId) {
    let targetStudent = null
    if (Array.isArray(students) === true) {
      students.forEach((student) => {
        if(student.id === studentId){
          targetStudent = student
        }
      })
    }
    return targetStudent;
  }

  static getStudentCurrentWorkType(studentInfo){
    let workType = 0;
    if(Object.keys(studentInfo).length === 0){
      return workType;
    }
    if(studentInfo.wink_service_issue_detail){
      workType = studentInfo.wink_service_issue_detail.current_work_type
    }
    return workType;
  }

  static isStudied(student){
    if(!student){
      return false;
    }
    if(student.status < 104){
      return false;
    } 
    return true
  }

  static getFindStudentOfStudents(studentList, studentId) {
    let studentInfo;
    studentList.forEach((info) => {
      if (info.id === studentId) {
        studentInfo = info;
      }
    })
    return studentInfo;
  }

  static canStudy(studentInfo) {
    if (studentInfo.status === ModelStatus.체험대기회원 || studentInfo.status === ModelStatus.유료회원) {
      if (studentInfo.wink_service_issue_detail) {
        if (studentInfo.wink_service_issue_detail.current_work_type === WorkType.CSRFirstLoginNotifyWork) {
          return true;
        }
      }
    }
    return false;
  }

  static learningTerm(studentInfo){
    if(!studentInfo.service_limit_date || !studentInfo.service_start_date){
      return false
    }
    return `${moment(studentInfo.service_start_date).format('YYYY.MM.DD')}~${moment(studentInfo.service_limit_date).format('YYYY.MM.DD')}`    
  }

  static getSubjectFullNameLabel(studentInfo){
    if(!studentInfo){
      return '';
    }
    //ItemTopCategoryTagName.오늘의공부
    let subjectCode = ParentsUtil.getStudentCurrentSubjectCode(studentInfo);
    let korean = ParentsUtil.getSubjectFullName(studentInfo, ItemMiddleCategoryTagName.오늘의공부.한글);
    let math = ParentsUtil.getSubjectFullName(studentInfo, ItemMiddleCategoryTagName.오늘의공부.수학);
    let english = ParentsUtil.getSubjectFullName(studentInfo, ItemMiddleCategoryTagName.오늘의공부.스토리영어);
    let phonics = ParentsUtil.getSubjectFullName(studentInfo, ItemMiddleCategoryTagName.오늘의공부.파닉스);
    
    //종합
    if(subjectCode === StudentSubject.StudentSubjectTotal){
      return `${korean}•${math}•${english}•${phonics}•독서/활동`;
    } else if(subjectCode === StudentSubject.StudentSubjectKorMath){
      //한글 수학
      return `${korean}•${math}`;
    } else if(subjectCode === StudentSubject.StudentSubjectEng){
      //영어
      return `${english}•${phonics}`;
    } 
    return '';       
  }

  static getSubjectFullNameLabelForProductName(studentInfo, productName) {
    //ItemTopCategoryTagName.오늘의공부
    let korean = ParentsUtil.getSubjectFullName(studentInfo, ItemMiddleCategoryTagName.오늘의공부.한글);
    let math = ParentsUtil.getSubjectFullName(studentInfo, ItemMiddleCategoryTagName.오늘의공부.수학);
    let english = ParentsUtil.getSubjectFullName(studentInfo, ItemMiddleCategoryTagName.오늘의공부.스토리영어);
    let phonics = ParentsUtil.getSubjectFullName(studentInfo, ItemMiddleCategoryTagName.오늘의공부.파닉스);
    
    //종합
    if(productName === '종합반'){
      return `${korean}•${math}•${english}•${phonics}•독서/활동`;
    } else if(productName === '한글・수학'){
      //한글 수학
      return `${korean}•${math}`;
    } else if(productName === '영어'){
      //영어
      return `${english}•${phonics}`;
    } 
    return ''; 
  }

  static getPurchaseName(productName, contract_years) {
    let retValue = productName;
    if (contract_years) {
      retValue += `(${contract_years}년약정)`
    } else {
      retValue += '(무약정)'
    }
    return retValue;
  }

  static isLearnable(info){
    let age = 1;
    if (info && info.sdata && info.sdata.auth_detail) {
      age = ParentsUtil.getAge(info.sdata.auth_detail.birthday);
    } else {
      age = ParentsUtil.getAge(info);
    }
    if (moment().format('YYYY') === '2017') {
      if(3 > age || 7 < age){
        return false;
      }
      return true;
    }

    if(3 > age || 8 < age){
      return false;
    }
    return true;
  }

  static getPriceFormat(price) {
    if (price) {
      return price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    } else {
      return '';
    }
  }

  static getDeliveryListName(deliveryInfoData){
    if(!deliveryInfoData){
      return ''
    }
    let picking_list = deliveryInfoData.picking_list
    if(picking_list){
      let listNameArr = [];
      let listName = '';
      if(picking_list.StudentDevice){
        listNameArr.push('학습단말기');
      }
      if(picking_list.EducationMaterial && picking_list.EducationMaterial.length){
        listNameArr.push(`교재 ${picking_list.EducationMaterial.length}권 `)
      }
      if(picking_list.StudentDeviceAccessory && picking_list.StudentDeviceAccessory.length){
        listNameArr.push(`학습단말기 부품(${picking_list.StudentDeviceAccessory.length}개)`);
      }

      listNameArr.forEach((item, index)=>{
        if(listNameArr.length === (index+1)){
          listName += item
        } else {
          listName += (item +', ');
        }
      })

      return listName;
    } else {
      return ''
    }
  }

  static isShowStudyName(deliveryInfoData){
    if(!deliveryInfoData){
      return false
    }
    let picking_list = deliveryInfoData.picking_list;
    if(picking_list.StudentDevice || (picking_list.EducationMaterial && picking_list.EducationMaterial.length)){
      return true;
    } 
    
    return false;
  }

  static getServiceUrl(item) {
    if(!item){
      return ''
    }
    return (item.service_url || item.verifying_url);
  }

  static showContentsByUrl(contents) {
    //contents 는 회차 콘텐츠
    let url = 0;
    if(!contents.members) {
      return ''
    } else {
      contents.members.forEach((item) => {
        if(item.service_url || item.verifying_url) {
          return url++;
        }
      })
      if(url === 0) {
        return false;
      } else {
        return true;
      }
    }
  }

  static isMasterParent(parentActorInfo) {
    if (parentActorInfo) {
      const {auth_detail} = parentActorInfo;
      if (auth_detail) {
        if (auth_detail.name === 'LogisticsCenter' || auth_detail.name === 'DanbiOffice') {
          return true;
        }
      }
    }
    return false;
  }
  static isShowCheckListByStudiedAfter6Months(studentInfo){
    const subjectCode = ParentsUtil.getSubjectCodeByInfo(studentInfo);
    //유료회원이고 종합반일경우 보여주지 않습니다.
    if(subjectCode === StudentSubject.StudentSubjectTotal && studentInfo && studentInfo.status === ModelStatus.유료회원){
      return false;
    }
    //levels확인
    if(studentInfo && studentInfo.data){
      if(studentInfo.data.levels){
        let isChecked = Object.values(studentInfo.data.levels).indexOf(0) === -1 ? true : false
        //isChecked가 true이면 6개월이 지났는지 확인필요 
        //isChecked가 false이면 모두 수준이0임으로 체크리스트 보여줍니다.
        if(isChecked === false){
          return true;
        }
        if(studentInfo.data.levels_regist_date){
          if(6 > moment().diff(studentInfo.data.levels_regist_date, 'months')){
            return false;
          }
        }
      } 
    } 
    //data없음 레벨없음 levels_regist_date 없음
    return true;
  }

  static isCSRExperienceExaminationWork(studentInfo){
    if(studentInfo && studentInfo.wink_service_issue_detail && studentInfo.wink_service_issue_detail.current_work_type === WorkType.CSRExperienceExaminationWork){
      return true;
    }
    return false;
  }

  static isCSRExperienceInfoRequestWork(studentInfo){
    if(studentInfo && studentInfo.wink_service_issue_detail && studentInfo.wink_service_issue_detail.current_work_type === WorkType.CSRExperienceInfoRequestWork){
      return true;
    }
    return false;
  }
  
  //배열안 객체속성의 중복체크하는 함수
  static isArrOverlap(arr, attribute){
    if(Array.isArray(arr) === false || typeof attribute !== 'string'){
      return null;
    }
    let counterObject = {};
    let isOverlap = false;

    arr.forEach((item)=>{
      let name = item[attribute]
      if(counterObject[name]){
        counterObject[name] +=1;
      } else {
        counterObject[name] = 1;
      }
    })

    Object.keys(counterObject).forEach((key)=>{
      if(counterObject[key] > 1){
        isOverlap = true;
      }
    })

    return isOverlap;
  }
  //네임과 배열안에 속성 일치하는 배열의 item반환
  static getArrTargetItem(arr, attribute, name){
    if(Array.isArray(arr) === false || typeof attribute !== 'string'){
      return null;
    }
    let isOverlap;
    arr.forEach((item)=>{
      if(item[attribute] === name){
        isOverlap = item;
      }
    })
    return isOverlap;
  }
  //학습시간 30일이하
  static isServiceLimitDateHas1Month(studentInfo){
    if(!studentInfo){
      return false
    }
    return moment().isBetween(moment(studentInfo.service_limit_date).add(-1, 'month').toDate(), studentInfo.service_limit_date);
  }

  static getContractYears(studentInfo, paymentList) {
    //최신 결제정보를 가져옵니다.
    let contractYears = undefined;
    // this.props.autoPaymentList를 받아 무약정인지 판단할 경우
    if (paymentList.results) {
      const studentPaymentInfo = paymentList.results.filter((paymentInfo) => studentInfo.id === paymentInfo.student)[0];
      if (studentPaymentInfo) {
        contractYears = studentPaymentInfo.contract_years;
      }
    } else {
      // this.props.studentPaymentContractListInfo을 받아 무약정인지 판단할 경우
      Object.keys(paymentList).forEach((propertyName) => {
        if (paymentList[propertyName][0] && paymentList[propertyName][0].student === studentInfo.id) {
          return contractYears = paymentList[propertyName][0].contract_years;
        }
      })
    }

    // null = 무약정, 1 = 1년약정, 2 = 2년약정
    return contractYears;
  }
}

export default ParentsUtil;