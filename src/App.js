import './App.css';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import {Box, Button, Flex, Heading, Spacer} from "@chakra-ui/react";
import {useAccount} from "wagmi";
import MDEditor from '@uiw/react-md-editor';
import React from "react";
import {Web3Storage} from "web3.storage";

const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMwODU1ZjNDRDM0MUM4OEU2QzY5ZDI0RTJENGE2MDJlOTU5QTU2YUMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjI3MzY5Njc5ODAsIm5hbWUiOiJrIn0.U0UtB-sT7OqxrlVksElB2p13BeiU_2WPQj68gR861nc"

function App() {

    const {isConnected} = useAccount();

    const [showMDEditor, isShowMDEditor] = React.useState(false)
    const [value, setValue] = React.useState("**typing here!!!**");


    const web3client =  new Web3Storage({ token: API_TOKEN })

    const writeMD = function (){
        isShowMDEditor(!showMDEditor)
    }


    const saveMkContent = function (){

    }

    return (
        <div className="App">
            <Flex minWidth='max-content' alignItems='center' gap='2'>
                <Box p='2'>
                    <Heading ml={'64px'} size='md' color={'white'}>Decentralized Web3 Markdown Platform</Heading>
                </Box>
                <Spacer/>
                <Flex px={"4em"} py={"1.5em"} justifyContent={"flex-end"}>
                    <ConnectButton/>
                    {isConnected && <Button onClick={()=>{writeMD()}} mx={'2em'} colorScheme='yellow'>Write Markdown</Button>}
                </Flex>
            </Flex>

            {
                showMDEditor && <div className="container" style={{marginLeft: 72, marginRight: 72}}>
                    <MDEditor
                        height={'100%'}
                        value={value}
                        onChange={setValue}
                    />
                    <MDEditor.Markdown style={{whiteSpace: 'pre-wrap'}}/>
                    <div style={{marginTop:16}}/>
                    <Button onClick={()=>{ isShowMDEditor(false) }} mx={'1em'} colorScheme='yellow'>Close Editor</Button>
                    <Button onClick={()=>{saveMkContent()}} mx={'1em'} colorScheme='yellow'>Save To IPFS/Filecoin</Button>
                </div>
            }
        </div>
    );
}

export default App;
