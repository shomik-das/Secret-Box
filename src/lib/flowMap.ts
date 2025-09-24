export const flowMap = {
    signin: { 
        next: "/auth/forgot-password" 
    },
    "send-otp": { 
        next: "/auth/verify-otp?flow=reset" 
    },
    "verify-reset": { 
        next: "/auth/reset-password"
    },
    "reset-password": { 
        next: "/auth/login" 
    },
    signup: { 
        next: "/auth/verify-otp?flow=signup" 
    },
    "verify-signup": { 
        next: "/auth/sign-in" 
    },
}
