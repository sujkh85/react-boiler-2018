import {StorageKey} from './constants/Code';
import Storage from './Storage';

class Session
{
	// private //
	static __userInfo = null;
	static get isLogin() { return this.userInfo !== null }
	static get isLoginToken() { return Storage.hasToken() }
	static get userInfo() { 
		if (this.__userInfo === null) {
			var userData = sessionStorage.getItem(StorageKey.SESSIONINFO);
			if (userData !== undefined ) {
				this.__userInfo = JSON.parse(userData);
			}
		}
		return this.__userInfo; 
	}
	static login(authId, actorId, userName, humanName, actorType, {...params}) {
		let oldParams = {}
		if(Session.userInfo){
			let SessionParams = Session.userInfo.params ? Session.userInfo.params : {}
			oldParams = {...SessionParams}
		}

		let newParams = {...oldParams,...params}
		
		this.__userInfo = {
			authId,
			actorId,
			userName,
			humanName,
			actorType,
			params:newParams
		};
		sessionStorage.setItem(StorageKey.SESSIONINFO, JSON.stringify(this.__userInfo));
	};
	static logout() {
		sessionStorage.removeItem(StorageKey.SESSIONINFO);
		this.__userInfo = null;
	}
	//parent app //
	static setAndModifyUserInfoParams(obj){
		if(Session.userInfo){
			let {authId, actorId, userName, humanName, actorType} = Session.userInfo;
			let params = {...Session.userInfo.params}
			//없으면 만들어 넣고 기존에 있으면 덥어 씁니다.
			Object.keys(obj).forEach((item)=>{
				params[item] = obj[item];
			})

			//정보 변경저장
			Session.login(authId, actorId, userName, humanName, actorType, params);
		}
	}
}

export default Session;