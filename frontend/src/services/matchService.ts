import axios from "axios";
const baseUrl = "/api/matches";

const createMatches = async () => {
    const response = await axios.post(`${baseUrl}/calculate`, {}, { withCredentials: true })
    return response.data
}

const getMatches = async () => {
    const response = await axios.get(baseUrl, { withCredentials: true })
    return response.data
}

export default {
    createMatches,
    getMatches
}