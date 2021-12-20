import Axios from "axios";
const URL = process.env.REACT_APP_BACKEND_URL
const SECURITY_KEY = process.env.REACT_APP_SECURITY_KEY ?? process.env.REACT_APP_SECRET_KEY;

const getUserById = async id => {
    if(id){
        let _userinfo = null;
        await Axios.post(`${URL}/users/get_by_id`, {id, key: SECURITY_KEY})
        .then(res => _userinfo = res.data)
        .catch(err => _userinfo =  err.response )
        return _userinfo
    }else return undefined;
}

export default getUserById