import { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';

import './style.scss';
import { Icon } from '../icon';
import GraphqlHelper from '../../graphql';
import { GET_TRANSLATE } from '../../graphql/translate';

const graphql = new GraphqlHelper()
export default function Translate(props: any) {
    const { text } = props
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const [rowData, setRowData] = useState({
        audio:"",
        text:""
    });
    const ref = useRef(null);

    const fetch = async (page: number = 1) => {
        const query: any = await graphql.query(GET_TRANSLATE, {
            text:text
        })
        const result = query?.translate
        if (result) {
            setRowData(result)
        }
    }

    useEffect(() => {
        
    }, [text]);

    const handleClick = (event: any) => {
        setShow(!show);
        fetch()
        setTarget(event.target);
    };

    return (
        <>
            <div ref={ref} className='translate'>
                <div className='txt'>

                    <p>{text}</p>
                    <Button onClick={handleClick}><Icon iconName='Translate'></Icon></Button>
                </div>

                <Overlay
                    show={show}
                    target={target}
                    placement="bottom"
                    container={ref}
                    containerPadding={20}
                >
                    <Popover id="popover-contained">
                        <Popover.Header as="h3">Translate</Popover.Header>
                        <Popover.Body>
                            <strong>{rowData.text}</strong>
                            <Icon iconName='VolumeUpFill' style={{ "cursor": "pointer" }} onClick={() => {
                                                                        let audio = new Audio(rowData.audio)
                                                                        audio.play()
                                                                    }}></Icon>
                        </Popover.Body>
                    </Popover>
                </Overlay>
            </div>
        </>
    )
}