const { default: Axios } = require("axios")
const { default: URL } = require("../Static/Backend.url.static")
const { default: SECURITY_KEY } = require('../Static/SecretKey.static');

const getUserByToken = async token => {
    if(token){
        let _userinfo = null;
        await Axios.post(`${URL}/users/get_by_token`, {token, SECURITY_KEY})
        .then(res => _userinfo = res.data)
        .catch(err => _userinfo =  err.response )
        return _userinfo
    }else return undefined;
}

module.exports = getUserByToken;