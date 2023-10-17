export const reducer = (state:any, action:any) => {
  switch (action.type) {
    case "toggle_button":
      return {
        ...state,
        active: !state.active
      }

    default:
      return state
  }
}
export enum TypeNotifyModal{
  ERROR,
  WARING,
  SUCCSESS
}
export const initialState = {
  active: false,
  type:TypeNotifyModal,
  message: String()
}