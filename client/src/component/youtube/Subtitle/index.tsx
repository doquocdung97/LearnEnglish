import { useRef } from "react"
import { Subtitle, WordQuestion } from "../utils"
import { Icon } from "../../icon";
import './style.scss';

function SubTitleItem(props: any) {
    const { data, onActive, parentRef, active, index, test } = props
    const elementRef = useRef(null);
    const current: any = elementRef.current
    // var itemScrollPosition = 0
    // if (current) {
    // 	const scrollPosition = parentRef.current.scrollTop;
    // 	const itemRect = current.getBoundingClientRect();
    // 	itemScrollPosition = itemRect.top + scrollPosition;
    // 	console.log(`List Item top: ${itemRect.top}, Scroll Position: ${itemScrollPosition}`);

    // }
    const getscrollTop = () => {
        var itemScrollPosition = 0
        if (current) {
            const scrollPosition = parentRef.current.scrollTop;
            const itemRect = current.getBoundingClientRect();
            const parentRect = parentRef.current.getBoundingClientRect()

            itemScrollPosition = (itemRect.top - parentRect.top) + scrollPosition;

        }
        return itemScrollPosition
    }
    if (active) {
        let top = getscrollTop()
        // console.log(`Row Top: ${top}`)
        parentRef.current?.scrollTo(0, (top - parentRef.current.clientHeight / 2))
    }
    let text = (<p>{data.text}</p>);
    if (test && data.exercise) {
        text = (
            data.exercise.Question?.map((item: WordQuestion, i: number) => {
                if (item.hide) {
                    // return <div key={i} className={item.error ? "error" : "active"}><p></p></div>
                    if (item.reply) {
                        return <div key={i} className={item.error ? "error" : "active"}><p>{item.reply}</p></div>
                    }
                    return <p className='' key={i}>.......</p>
                } else {
                    return <p key={i}>{item.text}</p>
                }
            })
        )
    }
    return (
        <div ref={elementRef} className={`item ${active ? 'active' : String()}`} onClick={() => onActive(index)}>
            <div className='txt'>{text}</div>
            {/* <div className='tools'>
				<button className='btn'><Icon iconName='Stopwatch'></Icon></button>
				<button className='btn'><Icon iconName='ArrowRepeat'></Icon></button>
			</div> */}

        </div>
    )
}
export function Subtitles(props: any) {
    const { data, test, indexsub, onActive } = props
    const subtitleRef = useRef(null)
    return (
        <>

            <div className='subtitles' >
                <div className="tools">

                </div>
                <div className="list" ref={subtitleRef}>
                    {
                        data?.map((item: Subtitle, index: number) => {
                            return <SubTitleItem data={item} key={index} index={index} active={indexsub == index} test={test} onActive={onActive} parentRef={subtitleRef} />
                        })
                    }
                </div>

            </div>
        </>
    )
}