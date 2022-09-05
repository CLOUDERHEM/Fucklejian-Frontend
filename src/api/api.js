import ajax from "./ajax";

const PREFIX = '/api'

const uploadDetail = (data, ak) => ajax(PREFIX + '/upload', data, ak, 'POST')

const getResult = (id, ak) => ajax(PREFIX + '/result', {id, ak})

export default {
    uploadDetail, getResult
}
