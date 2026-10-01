
// const BackendUrl = "http://192.168.100.247:9000"; 
const BackendUrl = "http://192.168.100.159:9000"




import { ApiClient } from "../api/ApiClient";

export interface SignupData {
    email: string;
    password: string;
    gender: string;
    name: string;
}
export interface LoginData {
    email: string

}

export async function createUser(
    signupData: SignupData
) {
    return ApiClient(
        `${BackendUrl}/auth/signup`,
        {
            method: "POST",

            body: JSON.stringify(
                signupData
            ),
        }
    );
}

export interface LoginData {
    email: string;
}

export async function loginUser(
    loginData: LoginData
) {
    return ApiClient(
        `${BackendUrl}/auth/login`,
        {
            method: "POST",

            body: JSON.stringify(
                loginData
            ),
        }
    );
}


export async function LogoutUser() {
    return ApiClient(
        `${BackendUrl}/auth/logout`,
        {
            method: "POST",

        
        }
    );
}

