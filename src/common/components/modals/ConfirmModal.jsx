import React, { Component } from 'react';
import LayerPopup from '../../../library/layerpopup';

class ConfirmModal extends Component {
  onClickButton=(e, type)=> {
    e.preventDefault();
    let {callback, param} = this.props;
    let resultCallback = false;
    if (callback) {
      resultCallback = callback(type, param);
      if (resultCallback === undefined) {
        resultCallback = true;
      }
    } else {
      resultCallback = true;
    }
    if (resultCallback && this.props.layerKey) {
			LayerPopup.hide(this.props.layerKey);
		}
  }

  render() {
    let {message, leftButtonLabel='확인', rightButtonLabel='취소'} = this.props;
    return (
        <div className="layer-wrap" style={{marginTop: '-85px'}}>{/* style은 임시임 script로 처리 */}
          <div className="lay-container">
            <div className="layer-id-check">
              {React.isValidElement(message) && <p>{message}</p>}
							{!React.isValidElement(message) && <p dangerouslySetInnerHTML={{__html:message}}></p>}
              <div className="btn-area" style={{width:'50%', float:'left', borderRight:'1px solid #e1e1e1', boxSizing:'border-box', margin:'0px'}}>
                <a href="#" onClick={(e) => this.onClickButton(e, 'LEFT')}>{leftButtonLabel}</a>
              </div>
              <div className="btn-area" style={{width:'50%', float:'left',margin:'0px'}}>
                <a href="#" onClick={(e) => this.onClickButton(e, 'RIGHT')}>{rightButtonLabel}</a>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default ConfirmModal;