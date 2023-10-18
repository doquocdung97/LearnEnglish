import './style.scss';
import { Icon } from "../icon";
import { useState } from 'react';

export function InputSearch(props: any) {
  const [q, setQ] = useState(String())
  const {onSubmit} = props
  const submit = (event:any)=>{
    event.preventDefault();
    onSubmit(q)
  }
  return (
    <form className="search-form" onSubmit={submit}>
      <input placeholder='Search...' onChange={e=>setQ(e.target.value)}/>
      <div className="btn-search">
        <button type='submit'><Icon iconName="Search"></Icon></button>
      </div>
    </form>
  )
}