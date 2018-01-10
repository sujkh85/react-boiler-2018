import {StorageKey} from '../library/constants/Code';

export default class SaveLocation {
	static saveSearch(location){
		if (typeof location === 'string') {
			localStorage.setItem(StorageKey.SAVE_LOCATION, location);
		} else if (location.search) {
			localStorage.setItem(StorageKey.SAVE_LOCATION, location.search);
		}
	}
	
	static loadSearch() {
		const search = localStorage.getItem(StorageKey.SAVE_LOCATION);
		localStorage.removeItem(StorageKey.SAVE_LOCATION)
		return search;
	}

	static hasSaveSearch() {
		return localStorage.getItem(StorageKey.SAVE_LOCATION) !== undefined;
	}
} 