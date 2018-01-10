import React, { Component } from 'react';
import LayerPopup from '../../../library/layerpopup';

class NoticeModal extends Component {
  constructor(props){
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e, type) {
    e.preventDefault();
    if('CLOSE' === type){
      let {callback, param} = this.props;
      let resultCallback = false;
      if (callback) {
        resultCallback = callback(type, param);
        if (resultCallback === undefined) {
          resultCallback = true;
        }
      } else{
        resultCallback = true;
      }
      if (resultCallback && this.props.layerKey) {
        LayerPopup.hide(this.props.layerKey);
      }
    }
    else if('XCLOSE' === type){
      if(this.props.layerKey){
        LayerPopup.hide(this.props.layerKey);
      }
    }
    
  }

  render() {
    let {message, buttonLabel='확인'} = this.props;
    return (
        <div className="layer-wrap" style={{marginTop: '-85px'}}>{/* style은 임시임 script로 처리 */}
          <div className="lay-container">
            <div className="layer-id-check">
              {React.isValidElement(message) && <p>{message}</p>}
							{!React.isValidElement(message) && <p dangerouslySetInnerHTML={{__html:message}}></p>}
              <div className="btn-area" style={{margin:'0px'}}>
                <a href="#" onClick={(e) => this.onClick(e, 'CLOSE')}>{buttonLabel}</a>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default NoticeModal;