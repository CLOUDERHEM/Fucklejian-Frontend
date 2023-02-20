import ajax from "./ajax";

const PREFIX = '/api'

const uploadDetail = (data, ak) => ajax(PREFIX + '/running/upload', data, {ak}, 'POST')

const getResult = (id, ak) => ajax(PREFIX + '/running/query', {id, ak})

export default {
    uploadDetail, getResult
}
