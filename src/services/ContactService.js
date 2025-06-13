import requests from "./httpService";

const UserServices = {

    getPrivicyPolicy : async () =>{
        return requests.get(`/app/?data=privacyPolicy`);
    },
    updateAppPolicy : async (body) =>{
        return requests.patch(`/app/`,body);
    },

    getTermCondition : async () =>{
        return requests.get(`/app/?data=termsAndCondition`);
    },

    getAboutus : async () =>{
        return requests.get(`/app/?data=about`);
    },
    
    getCancel : async () =>{
        return requests.get(`/app/`);
    },
    getContactDetail : async () =>{
        return requests.get(`/contact`);
    },
    
    updateContactDetail : async (id,body) =>{
 
        return requests.patch(`/contact/${id}`,body);
    },

}

export default UserServices;