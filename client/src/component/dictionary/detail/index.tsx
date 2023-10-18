import { useState } from "react";
import GraphqlHelper from "../../../graphql";
import { SEARCH_DICTIONARY } from "../../../graphql/dictionary";
import { Modal, Button, Accordion } from "react-bootstrap";
import { Icon } from '../../icon';
import './style.scss';
const graphql = new GraphqlHelper()
export default function DictionaryDetail(props: any) {
  const { show, handleClose, word, onHandleSave } = props
  const [rowdata, setRowdata] = useState<{
    translate: "",
    phonetic: {
      text: "",
      audio: ""
    },
    meanings: [
      {
        type: "",
        definitions: [
          {
            definition: "",
            example: ""
          }
        ]
      }
    ]
  } | null>(null);
  const onHandleShow = () => {
    setRowdata(null)
    graphql.query(SEARCH_DICTIONARY, { word }).then((data: any) => {
      if (data.searchDictionary.data.length > 0) {
        setRowdata(data.searchDictionary.data[0])
      }

      // console.log("data",data[0])
    }).catch(error => {

    })
  }

  return (
    <Modal show={show} onHide={handleClose} onShow={onHandleShow} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{word}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          (rowdata) && (
            <div className="dictionary-detail">
              <div className="translate">
                <label>Translate: {rowdata.translate}</label>
              </div>
              <div className="detail">

                {
                  (rowdata.phonetic && rowdata.phonetic.audio) && (
                    <>
                      <p>text: <strong>{rowdata.phonetic.text}</strong> <Icon iconName='VolumeUpFill' style={{ "cursor": "pointer" }} onClick={() => {
                        let audio = new Audio(rowdata.phonetic.audio)
                        audio.play()
                      }}></Icon></p>
                      {/* <label>audio: {phonetic.audio}</label> */}
                    </>
                  )
                }
              </div>
              <div className="meanings">
                <Accordion defaultActiveKey="0">
                  {
                    rowdata.meanings.map((meaning: any, key: number) => {
                      if (meaning && meaning.definitions) {
                        return (

                          <Accordion.Item eventKey={`${key}`} key={key} className="meaning">
                            <Accordion.Header>Type:<strong>{meaning.type}</strong></Accordion.Header>
                            <Accordion.Body className="definitions-example">
                              {
                                meaning?.definitions?.map((item: any) => {
                                  return (
                                    <div className="txt">
                                      <p>definitions: <strong>{item.definition}</strong></p>
                                      <p>example: <strong>{item.example}</strong></p>
                                    </div>
                                  )
                                })
                              }
                            </Accordion.Body>
                          </Accordion.Item>
                        )
                      }

                    })
                  }
                </Accordion>
              </div>
            </div>
          )
        }

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onHandleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>

  );
}