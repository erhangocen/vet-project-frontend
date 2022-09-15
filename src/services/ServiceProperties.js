import packageProps from "../../package.json"

export default function apiProps() {
    return({
        baseUrl : packageProps.apiUrl,
        jsonConfig : {
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '+ localStorage.getItem("token")
            }
        }  
    })
    
}


