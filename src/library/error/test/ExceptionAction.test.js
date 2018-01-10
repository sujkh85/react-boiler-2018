import React, { Component}  from 'react';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme';
import {axios} from '../../APICaller';

import * as BoardAction from '../../board/BoardAction';
import * as ExceptionAction from '../../error/ExceptionAction';
import ExceptionReducer ,{initialState}from '../ExceptionReducer';
import {ExceptionContainer}from '../../../error/ExceptionContainer';

describe('에러', () => {
	let mock;
	let store;
	let mockStore;
	class LocalStorageMock {
		constructor() {
			this.store = {};
		}

		clear() {
			this.store = {};
		}

		getItem(key) {
			return this.store[key];
		}

		setItem(key, value) {
			this.store[key] = value.toString();
		}
	};

	global.sessionStorage = new LocalStorageMock();
	global.localStorage = new LocalStorageMock();

	beforeEach(() => {
		mock = new MockAdapter(axios, {delayResponse:10 });
		const middlewares = [ thunk ];
		mockStore = configureMockStore(middlewares);
    store = mockStore({ ExceptionReducer: {ex : null} })   
	});

	describe('error', ( ) => {
    beforeEach(() => {
    });

    it('오류확인', async()=> {
      mock.onPost('/board/posts/212/like/').reply(500,{detail: 'err'});
      let expectLikePostAction =[]
      expectLikePostAction.push({
        type: ExceptionAction.ActionTypes.EXCEPTION,
				payload:{
					message : 'err',
				}
      })
      await store.dispatch(BoardAction.likePost(212)).then(() => {
        const actionResult = store.getActions();
        expect(actionResult[0].payload.message).toBe('좋아요 선택중 오류가 발생하였습니다.')
        store.clearActions();
      })
    })
  })

	describe('error components', ( ) => {

    it('오류확인', async()=> {
			const spy = sinon.spy(ExceptionContainer.prototype, 'componentWillReceiveProps');
			const wrapper = shallow(<ExceptionContainer ex={null} />);
			expect(spy.calledOnce).toEqual(false);
			wrapper.setProps({ ex:{response:{status:400}, message:'좋아요 선택중 오류가 발생하였습니다.' }});
			expect(spy.calledOnce).toEqual(true);
			console.log(wrapper.instance().props);
			console.log(wrapper.find('.layer-id-check'));

      await store.dispatch(BoardAction.likePost(212)).then(() => {
        const actionResult = store.getActions();
        expect(actionResult[0].payload.message).toBe('좋아요 선택중 오류가 발생하였습니다.')
        store.clearActions();
      })
    })
  })

})


