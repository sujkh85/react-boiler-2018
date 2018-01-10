export default class IndexedDBUtil {
	constructor(dbName, version, storeName) {
		this.dbName = dbName;
		this.version = version;
		this.storeName = storeName;
	}
	open(createIndex) {
		this.db = null;
		return new Promise((resolve, reject) => {
			const request = window.indexedDB.open(this.dbName, this.version);
			request.onsuccess = function (evt) {
				const db = evt.target.result;
				resolve(db);
			};
			request.onerror = function (err) {
				reject(err);
			}
			request.onupgradeneeded = function(evt) {
  			const db = evt.target.result;
				if (typeof createIndex === 'function') {
					createIndex(db);
				}
			}
		}).then((db) => {
			this.db = db;
			return db;
		});
	}
	getStore() {
		this.idx = 0;
		const tx = this.db.transaction([this.storeName], 'readwrite');
		const store = tx.objectStore(this.storeName);
		return store;
	}
	add(value) {
		return new Promise((resolve, reject) => {
			const store = this.getStore(this.storeName);
			const request = store.add(value);
			request.onsuccess = function(evt) {
					resolve(value);
			}
			request.onerror = (evt) => {
				reject(evt);
			}
		});
	}
	get(key) {
		return new Promise((resolve, reject) => {
			const store = this.getStore(this.storeName);
			const request = store.get(key);
			request.onsuccess = function(evt) {
				const value = evt.target.result;
				resolve(value);
			}
			request.onerror = (evt) => {
				reject(evt);
			}
		});
	}
	getRangeIndex (indexName, to) {
		return new Promise((resolve, reject) => {
			const store = this.getStore(this.storeName);
			const index = store.index(indexName);
			const boundKeyRange = IDBKeyRange.upperBound(to);
			const request = index.openCursor(boundKeyRange);
			let pkList = [];
			request.onsuccess = function(evt) {
				const cursor = evt.target.result;
				if (cursor) {
					pkList.push(cursor.primaryKey);
					cursor.continue();
					return;
				}
				resolve(pkList);
			}
			request.onerror = (evt) => {
				reject(evt);
			}
		});
	}

	put(value) {
		return new Promise((resolve, reject) => {
			const store = this.getStore(this.storeName);
			if (store) {
				try
				{
					const request = store.put(value);
					request.onsuccess = function(evt) {
							resolve(value);
					}
					request.onerror = (evt) => {
						reject(evt);
					}
				} catch(e) {
					reject({message:'초기화 오류 발생'});
				}
			} else {
				reject({message:'초기화 오류 발생'});
			}
		});
	}
	count() {
		return new Promise((resolve, reject) => {
			const store = this.getStore(this.storeName);
			const request = store.count();
			request.onsuccess = function(evt) {
					resolve(evt.target.result);
			}
			request.onerror = (evt) => {
				reject(evt);
			}
		});
	}
	getAll() {
		return new Promise((resolve, reject) => {
			const store = this.getStore(this.storeName);
			const request = store.getAll();
			request.onsuccess = function(evt) {
					resolve(evt.target.result);
			}
			request.onerror = (evt) => {
				reject(evt);
			}
		})
	}

	getAllKeys(indexName) {
		return new Promise((resolve, reject) => {
			const store = this.getStore(this.storeName);
			const index = store.index(indexName);
			const request = index.getAllKeys();
			request.onsuccess = function(evt) {
					resolve(evt.target.result);
			}
			request.onerror = (evt) => {
				reject(evt);
			}
		})
	}

	remove(key) {
		return new Promise((resolve, reject) => {
			const store = this.getStore(this.storeName);
			const request = store.delete(key);
			request.onsuccess = function (evt) {
				resolve(key);
			}
			request.onerror = (evt) => {
				reject(evt);
			}
		});
	}
	removeIndexRange(indexName, to) {
		return new Promise((resolve, reject) => {
			const store = this.getStore(this.storeName);
			const index = store.index(indexName);
			const boundKeyRange = IDBKeyRange.upperBound(to);
			const request = index.openCursor(boundKeyRange);
			let pkList = [];
			request.onsuccess = (evt) => {
				const cursor = evt.target.result;
				if (cursor) {
					cursor.source.objectStore.delete(cursor.primaryKey);
					pkList.push(cursor.primaryKey);
					cursor.continue();
					return;
				}
				resolve(pkList);
			}
			request.onerror = (evt) => {
				reject(evt);
			}
		});
	}
}