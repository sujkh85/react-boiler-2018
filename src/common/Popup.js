import React from 'react';
import {LayerPopup} from '../library/layerpopup'
import ModalContainer from './components/modals/ModalContainer';
import LayerContainer from './components/modals/LayerContainer';
import NoticeModal from './components/modals/NoticeModal';
import ConfirmModal from './components/modals/ConfirmModal';

export default class Popup {
	static layer(LayerPageComponent, option) {
		return LayerPopup.show(<LayerContainer option={option}>{LayerPageComponent}</LayerContainer>);
	}
	
	static modal(LayerPageComponent){
		return LayerPopup.show(<ModalContainer>{LayerPageComponent}</ModalContainer>);
	}

	static noticeModal(props){
		return LayerPopup.show(<ModalContainer><NoticeModal {...props}/></ModalContainer>);
	}

	static confirmModal(props){
		return LayerPopup.show(<ModalContainer><ConfirmModal {...props}/></ModalContainer>);
	}

	static hide(layerKey) {
		LayerPopup.hide(layerKey);
	}
}