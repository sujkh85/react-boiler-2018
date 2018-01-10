import React, { Component } from 'react';
import LayerPopup from '../../../library/layerpopup';

class Modal extends Component {
  constructor(props){
    super(props);

    this.onClick = this.onClick.bind(this); 
  }

  onClick(e, type) {
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
    let {message, buttonLabel='확인', showXButton = true} = this.props;
    return (
      <section id="lay-wrap" className="view-layer" style={{width:'102%'}}>
        <div className="dim">&nbsp;</div>
        <div className="layer-wrap" style={{marginTop: '-85px'}}>{/* style은 임시임 script로 처리 */}
          <div className="lay-container">
            <div className="layer-id-check">
							{React.isValidElement(message) && <p>{message}</p>}
							{!React.isValidElement(message) && <p dangerouslySetInnerHTML={{__html:message}}></p>}
              <div className="btn-area" >
                <a href="#" onClick={(e) => this.onClick(e, 'CLOSE')}>{buttonLabel}</a>
              </div>
              {showXButton && <button className="close-lay" onClick={(e) => this.onClick(e, 'CLOSE')}><span className="icon-button">모달닫기</span></button>}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Modal