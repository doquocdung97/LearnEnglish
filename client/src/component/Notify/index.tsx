
import { createContext, useReducer } from 'react';
import './style.scss';
import { reducer, initialState, TypeNotifyModal } from './reducer';
import { Button, Modal } from 'react-bootstrap';

export const NotifyContext = createContext({
  state: initialState,
  show: (message: string, type: TypeNotifyModal) => null
})

export const NotifyModal = ({ children }: any) => {
  const [state, show] = useReducer(reducer, initialState)
  const onShow = (message: string, type: TypeNotifyModal) => {
    // show(message,type)
    return null
  }
  return (
    <NotifyContext.Provider value={{ state, show:onShow}}>
      {children}
      <Modal show={state.active} size='sm'>
        <Modal.Body>
          <div className='notify-modal'>
            <div className='icon'>
              <img src='/assets/icon/checked.png' />
            </div>
            <p className='txt-title'>{state.message}</p>
            <Button>Close</Button>
          </div>

        </Modal.Body>
      </Modal>
    </NotifyContext.Provider>
  )
}
export default NotifyModal;