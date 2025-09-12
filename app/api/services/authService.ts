import axios from 'axios';

interface RegisterParams {
    username: string;
    email: string;
    password: string;
}

interface RegisterResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export async function registerUser({
    username,
    email,
    password
}: RegisterParams): Promise<RegisterResponse> {
    try {
        const response = await axios.post('/api/auth/register', {
            username,
            email,
            password
        });
        
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('Registration failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}