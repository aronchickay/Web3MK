import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, Button, Text, useDisclosure,
} from '@chakra-ui/react'
import MDEditor from "@uiw/react-md-editor";
import React from "react";

function MDView(props) {

    const onClose = function () {
        props.close()
    }

    return (
        <>
            <Modal onClose={onClose} size={'full'} isOpen={props.open}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{props.title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <MDEditor.Markdown source={props.value} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default MDView;
