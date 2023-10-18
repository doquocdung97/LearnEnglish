
import { createContext, useReducer, useState } from 'react';
import './style.scss';
import { reducer, initialState, TypeNotifyModal } from './reducer';
import { Button, Modal } from 'react-bootstrap';

export const NotifyContext = createContext({
  // state: initialState,
  active: false,
  message: String(),
  show: (message: string, type: TypeNotifyModal,func:()=>void) => null
})

export const NotifyModal = ({ children }: any) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(String());
  const [type, setType] = useState<TypeNotifyModal>(TypeNotifyModal.SUCCSESS);
  const [callback, setCallback] = useState<() => void>(
    () => console.log('default ooops')
  );
  const onShow = (message: string, type: TypeNotifyModal,func:()=>void) => {
    // show(message,type)
    setMessage(message)
    setType(type)
    setShow(true)
    setCallback(() => func)
    return null
  }
  const onClose = () => {
    if(callback){
      callback()
    }
    setShow(false)
  }
  const data = {
    active: false,
    message: "Child Body",
    show: onShow
  };
  var image = '/assets/icon/checked.png'
  if(type === TypeNotifyModal.ERROR){
    image = '/assets/icon/error.png'
  }else if(type === TypeNotifyModal.WARING){
    image = '/assets/icon/attention.png'
  } 
  return (
    <NotifyContext.Provider value={data}>
      {children}
      <Modal show={show} size='sm' onHide={onClose}>
        <Modal.Body>
          <div className='notify-modal'>
            <div className='icon'>
              <img src={image} />
            </div>
            <p className='txt-title'>{message}</p>
            <Button onClick={onClose}>Close</Button>
          </div>

        </Modal.Body>
      </Modal>
    </NotifyContext.Provider>
  )
}
export default NotifyModal;