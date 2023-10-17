import './style.scss';
import { Icon } from "../icon";

export function InputSearch(props: any) {
  return (
    <div className="search-form">
      <input placeholder='Search...'/>
      <div className="btn-search">
        <button ><Icon iconName="Search"></Icon></button>
      </div>
    </div>
  )
}