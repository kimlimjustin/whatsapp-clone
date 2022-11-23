import Axios from "axios";
const URL = process.env.REACT_APP_BACKEND_URL
const SECURITY_KEY = process.env.REACT_APP_SECURITY_KEY ?? process.env.REACT_APP_SECRET_KEY;

const getAllUser = async token => {
    if (token) {
        let _userinfo = null;
        await Axios.post(`${URL}/users/get_all_users`, { key: SECURITY_KEY })
            .then(res => _userinfo = res.data)
            .catch(err => _userinfo = err.response)
        return _userinfo
    } else return undefined;
}

const getGroupByCode = async code => {
    if (code) {
        let _group_info = null;
        await Axios.post(`${URL}/group/get_by_code`, { code, key: SECURITY_KEY })
            .then(res => _group_info = res.data)
            .catch(err => _group_info = err.response)
        return _group_info
    } else return undefined;
}

const getGroupById = async id => {
    if (id) {
        let _userinfo = null;
        await Axios.post(`${URL}/group/get_by_id`, { id, key: SECURITY_KEY })
            .then(res => _userinfo = res.data)
            .catch(err => _userinfo = err.response)
        return _userinfo
    } else return undefined;
}

const getUserById = async id => {
    if (id) {
        let _userinfo = null;
        await Axios.post(`${URL}/users/get_by_id`, { id, key: SECURITY_KEY })
            .then(res => _userinfo = res.data)
            .catch(err => _userinfo = err.response)
        return _userinfo
    } else return undefined;
}

const getUserByToken = async token => {
    if (token) {
        let _userinfo = null;
        await Axios.post(`${URL}/users/get_by_token`, { token, SECURITY_KEY })
            .then(res => _userinfo = res.data)
            .catch(err => _userinfo = err.response)
        return _userinfo
    } else return undefined;
}


export { getGroupByCode, getAllUser, getGroupById, getUserById, getUserByToken }