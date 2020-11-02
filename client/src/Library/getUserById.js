const { default: Axios } = require("axios")
const { default: URL } = require("../Static/Backend.url.static")
const { default: SECURITY_KEY } = require('../Static/SecretKey.static');

const getUserById = async id => {
    if(id){
        let _userinfo = null;
        await Axios.post(`${URL}/users/get_by_id`, {id, key: SECURITY_KEY})
        .then(res => _userinfo = res.data)
        .catch(err => _userinfo =  err.response )
        return _userinfo
    }else return undefined;
}

module.exports = getUserById