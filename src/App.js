import './App.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {Box, Button, Flex, Heading, Spacer} from "@chakra-ui/react";
import {useAccount} from "wagmi";

function App() {
  const { isConnected } = useAccount();


  return (
    <div className="App">
      <Flex minWidth='max-content' alignItems='center' gap='2'>
        <Box p='2'>
          <Heading ml={'64px'} size='md' color={'white'} >Decentralized Web3 Markdown Platform</Heading>
        </Box>
        <Spacer />
        <Flex px={"4em"} py={"1.5em"} justifyContent={"flex-end"}>
          <ConnectButton />
          {isConnected && <Button mx={'2em'} colorScheme='yellow' >Write Markdown</Button>}
        </Flex>
      </Flex>
    </div>
  );
}

export default App;
