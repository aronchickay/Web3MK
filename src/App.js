import './App.css';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import {
    Box,
    Button,
    Flex,
    Heading,
    Spacer,
    useDisclosure,
    Input,
    List,
    ListItem,
    LinkOverlay,
    LinkBox, Text, Center
} from "@chakra-ui/react";
import {useAccount, useContractWrite, usePrepareContractWrite} from "wagmi";
import MDEditor from '@uiw/react-md-editor';
import React, {useEffect} from "react";
import {Web3Storage} from "web3.storage";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton
} from '@chakra-ui/react'
import {mkaddress} from "./contracts/contractAddress";
import contractAbi from "./contracts/Web3MarkDown.json";
import {BigNumber, utils} from "ethers";
import {PrivateKey} from "@textile/hub";
import * as A from "./space/UserInfo"
import {auth, getFiles} from "./space/UserInfo";
import MDView from "./MDView";

const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMwODU1ZjNDRDM0MUM4OEU2QzY5ZDI0RTJENGE2MDJlOTU5QTU2YUMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjI3MzY5Njc5ODAsIm5hbWUiOiJrIn0.U0UtB-sT7OqxrlVksElB2p13BeiU_2WPQj68gR861nc"

function App() {

    const {address,isConnected} = useAccount();
    const [mkTitle, setMkTitle] = React.useState('')

    const [showMDEditor, isShowMDEditor] = React.useState(false)
    const [showMDView, isShowMDView] = React.useState(false)
    const [mdViewSource, setMDViewSource] = React.useState("");
    const [mdViewTitle, setMDViewTitle] = React.useState("");


    const [value, setValue] = React.useState("**typing here!!!**");

    const { isOpen, onOpen, onClose } = useDisclosure()


    const [files, setFiles] = React.useState([])

    const [identity, setIdentity] = React.useState('')
    const [spaceClient, setSpaceClient] = React.useState('')

    const web3client =  new Web3Storage({ token: API_TOKEN })

    async  function fetchData(client,identity){
        const netFiles = await A.getFiles(identity,client)
        console.log(netFiles)
        setFiles(netFiles[0].files)
    }

    useEffect( () => {
        if(isConnected){
            if(!identity){
                const hash = utils.keccak256(address);
                const array = hash
                    // @ts-ignore
                    .replace('0x', '')
                    // @ts-ignore
                    .match(/.{2}/g)
                    .map((hexNoPrefix) => BigNumber.from('0x' + hexNoPrefix).toNumber())

                if (array.length !== 32) {
                    throw new Error('Hash of signature is not the correct size! Something went wrong!');
                }
                const fromRawEd25519Seed = PrivateKey.fromRawEd25519Seed(Uint8Array.from(array)).toString()
                if(!spaceClient){
                    console.log(fromRawEd25519Seed)
                    A.auth(fromRawEd25519Seed).then(async (v) => {
                        setSpaceClient(v)
                        setIdentity(fromRawEd25519Seed)
                        await fetchData(v,fromRawEd25519Seed)
                    })
                }else{
                    fetchData(spaceClient,identity).then(r => {})
                }
            }
        }
    })


    const writeMD = function (){
        isShowMDEditor(!showMDEditor)
    }

    const handleChange = (event) => setMkTitle(event.target.value)

    const saveMkContent = async function () {
        onClose()

        const formattedContent = {
            content: value,
        }
        const content = JSON.stringify(formattedContent)
        const file = new File([content], "markdown", {type: 'text/plain'});
        const cid = await web3client.put([file]);
        const timestamp = new Date().getTime()

        const fileJson = {
            filename: mkTitle,
            cid: cid,
            createTime:timestamp.toString()
        }
        console.log(files)
        const result = files.filter(item => item.cid === cid)
        if (result && result.length < 1) {
            await A.storeFile(spaceClient, identity, fileJson)
            files.push(fileJson)
            setFiles(files)
            console.log(files)
        }

        isShowMDEditor(false)
    }

    const viewDetails = async function (v) {
        const url = "https://dweb.link/ipfs/" + v.cid + "/markdown"
        const res = await fetch(url)
        const resJson = await res.json();
        console.log(resJson)
        setMDViewTitle(v.filename)
        setMDViewSource(resJson['content'])
        isShowMDView(true)
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
                        height={'600px'}
                        value={value}
                        onChange={setValue}
                    />
                    <MDEditor.Markdown style={{whiteSpace: 'pre-wrap'}}/>
                    <div style={{marginTop:16}}/>
                    <Button onClick={()=>{ isShowMDEditor(false) }} mx={'1em'} colorScheme='yellow'>Close Editor</Button>
                    <Button onClick={()=>{onOpen()}} mx={'1em'} colorScheme='yellow'>Save To IPFS/Filecoin</Button>
                </div>
            }
            {
                <MDView open={showMDView}
                        value={mdViewSource}
                        title={mdViewTitle}
                        close={()=>{
                        isShowMDView(false)
                }
                }/>
            }

            {
                !showMDEditor &&
                isConnected &&
                <Center color='white' mt={'36px'}>
                    <List spacing={3}>
                        <Box w='100%' height={'32px'}>
                            <Flex color='white'>
                                <Text fontSize='2xl' w='200px' color={'white'}>
                                    {"title"}
                                </Text>
                                <Text fontSize='2xl' flex = '1' color={'white'}>
                                    {"cid"}
                                </Text>

                                <Text fontSize='2xl'  w='200px' color={'white'}>
                                    {'action'}
                                </Text>
                            </Flex>

                        </Box>
                        {files.map((reptile) => (
                            <ListItem w='100%' key={reptile.cid} >
                                <Flex color='white'>
                                    <Text w='200px' color={'white'}>
                                        {reptile.filename}
                                    </Text>
                                    <Text flex = '1' color={'white'}>
                                        {reptile.cid}
                                    </Text>

                                    <Text  onClick={()=>{viewDetails(reptile)}} w='200px' color={'white'}>
                                        {'view detail'}
                                    </Text>
                                </Flex>

                            </ListItem>
                        ))}
                    </List>
                </Center>
            }

            <AlertDialog
                motionPreset='slideInBottom'
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>Set Markdown title ?</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <Input
                            onChange={handleChange}
                            value={mkTitle} placeholder='please set title' />
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button onClick={onClose}>
                            No
                        </Button>
                        <Button colorScheme='red' ml={3} onClick={()=>{saveMkContent()}}>
                            Yes
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default App;
