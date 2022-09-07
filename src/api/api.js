import ajax from "./ajax2";

const PREFIX = '/api'

const uploadDetail = (data, ak) => ajax(PREFIX + '/running/upload', data, {ak}, 'POST')

const getResult = (id, ak) => ajax(PREFIX + '/running/query', {id, ak})

const generateAk = (count, ak) => ajax(PREFIX + '/ak/generate', {count, ak}, {ak},'POST')

const queryAk = (ak) => ajax(PREFIX + '/ak/query', {ak})
export default {
    uploadDetail, getResult, generateAk, queryAk
}
