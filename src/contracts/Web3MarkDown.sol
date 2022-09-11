// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;


contract Web3MarkDown{

    mapping (address => MKStruct[]) addressToMK;


    struct MKStruct{
        string  title;
        string  timestamp ;
        string  cid;
    }


    function addMK(string memory cid,string memory timestamp, string memory title) public {
        MKStruct[] storage arr = addressToMK[msg.sender]; //get the existing list
        MKStruct memory temp;
        temp.cid = cid;
        temp.timestamp = timestamp;
        temp.title = title;
        arr.push(temp);
        addressToMK[msg.sender] = arr;
    }

    function getMK(address addr) public view returns(MKStruct[] memory diarys){
        MKStruct[] storage mkArr = addressToMK[addr];
        return mkArr;
    }

}
