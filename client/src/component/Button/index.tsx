import { Icon } from "../icon";
import './style.scss';
export function ButtonIcon(props: any) {
    const { loading,iconName } = props
    if(loading){
        return (<button className=' btn-icon-sm loading'><Icon iconName="ArrowClockwise"></Icon></button>)
    }
    return (<button className=' btn-icon-sm' {...props}><Icon iconName={iconName}></Icon></button>)
}