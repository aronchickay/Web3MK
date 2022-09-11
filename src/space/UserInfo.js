import {Client, createUserAuth, PrivateKey, ThreadID, Where} from "@textile/hub";
import * as C from "./constants"

/// can also use init
const UserInfoSchema ={
    _id: '',
    identity:"",
    name:"",
    icon:"",
    filAddress:"",
    likeId:"",
    web3:""
}

const schema = {
    identity: "",
    _id: '',
    files:[
        {
            filename:"",
            cid:"",
            createTime:"",
        }
    ]
}

const init = {
    identity: "",
    _id: '',
    files:[
    ]
}

async function authByTextile (keyInfo) {
    // Create an expiration and create a signature. 60s or less is recommended.
    const expiration = new Date(Date.now() + 24* 24 * 60 * 60 * 1000)
    // Generate a new UserAuth
    return await createUserAuth(keyInfo.key, keyInfo.secret ?? '', expiration)
}


export const auth = async (userIdentity) => {
    if(userIdentity==null){
        return null;
    }

    const keyInfo = {
        key: "bnjau4mh6k3xf6cilgbqodi5b6i",
        secret:"bktx4rel47b73sut7xmnr54g4n6q3selt36e3wqy"
    };

    const userAuth = await authByTextile(keyInfo);
    const client = await Client.withUserAuth(userAuth);
    await  client.getToken(PrivateKey.fromString(userIdentity))
    return client
};

export const getLocalThreadId = async (client)=>{
    let localThreadId = await  localStorage.getItem("threadId")
    console.log("local thread id :"+localThreadId)
    if(!localThreadId || localThreadId === "null"){
        try {
            const thread = await client.getThread(C.DB.THREAD_NAME)
            localThreadId = thread.id;
        }catch (e) {
            console.log(e)
            if(e.toString().indexOf("Thread") !==-1 && e.toString().indexOf("found") !==-1){
                console.log("create")
                const newDbThread = await client.newDB(undefined, C.DB.THREAD_NAME)
                localThreadId = newDbThread.toString();
            }
        }
        localStorage.setItem("threadId",localThreadId)
    }
    return localThreadId;
}

export const getFiles = async (identity,client) => {
    if(client!=null){
        let localThreadId = await getLocalThreadId(client);
        const threadId = ThreadID.fromString(localThreadId);
        const query = new Where('identity').eq(identity)
        try {
            const findResult = await client.find(threadId,C.DB.FILES_COLLECTION,query)
            if(findResult &&findResult.length>0){
                return findResult;
            }
            let config = init
            config.identity = identity;
            await client.create(threadId, C.DB.FILES_COLLECTION, [config])
            return [config];
        }catch (e) {
            if(e.toString().indexOf("not found")!==-1){
                let config = init
                config.identity = identity;
                await client.newCollectionFromObject(threadId, schema,{name:C.DB.FILES_COLLECTION})
                await client.create(threadId, C.DB.FILES_COLLECTION, [config])
                return [config]
            }
        }
    }
    return [];
};


export const storeFile = async (client ,identity,fileJson)=>{
    console.log(fileJson)
    const threadId = ThreadID.fromString(await getLocalThreadId(client));
    const query = new Where('identity').eq(identity)
    const remoteUserConfigs = await client.find(threadId, C.DB.FILES_COLLECTION, query)
    if(remoteUserConfigs.length<1){
        console.log("why remote user config is empty?")
        return
    }
    const remoteUserConfig = remoteUserConfigs[0];
    // @ts-ignore
    remoteUserConfig.files.push(fileJson)
    await client.save(threadId, C.DB.FILES_COLLECTION, [remoteUserConfig])
}

