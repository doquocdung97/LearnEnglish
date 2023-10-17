import { Icon } from "../icon";
import './style.scss';
export function ButtonIcon(props: any) {
    const { loading,iconName ,size,className } = props
    let new_size = size || 26
    if(loading){
        return (<button {...props} className={`btn-icon-sm loading h-${new_size} w-${new_size}`}><Icon size={new_size} iconName="ArrowClockwise"></Icon></button>)
    }
    return (<button {...props} className={`${className} btn-icon-sm h-${new_size} w-${new_size}`}><Icon size={new_size} iconName={iconName}></Icon></button>)
}
export function ButtonLogin(props: any) {
    const { loading } = props
    if(loading){
        return (
        <button {...props} className={`${props.className} button__loader`} type="button"><span>Loading...</span></button>)
    }
    return (<button {...props}>{props.children}</button>)
}