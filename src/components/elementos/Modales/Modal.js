import { useState } from "react"
import { Modal } from "react-bootstrap";

function ModalBoostrap(props) {
    return (
        <Modal
            show={props.show}
            onHide={() => props.onHide()}
            dialogClassName="modal-80w"
            aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton>
                <Modal.Title>{props.titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.cuerpo}</Modal.Body>
        </Modal>
    )
}

export default ModalBoostrap