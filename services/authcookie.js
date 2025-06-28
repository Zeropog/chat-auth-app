const sessionIdToMap= new Map();

function setUserCookie(sessionid, user) {
    sessionIdToMap.set(sessionid, user);
}

function getUserCookie(sessionid) {
    return sessionIdToMap.get(sessionid);
}

export default {setUserCookie, getUserCookie};