import 'next-auth';

declare module 'next-auth' {
    interface User {
        _id?: string;
        name?: string;
        username?: string;
        email?: string;
        isVerify?: boolean;
        isAcceptingMessages?: boolean;
        image?: string;
    }
    interface Session {
        user: {
            _id?: string;
            name?: string;
            username?: string;
            email?: string;
            isVerify?: boolean;
            isAcceptingMessages?: boolean;
            image?: string;
        } & DefaultSession['user'];
    }
    interface JWT {
        user?: {
            _id?: string;
            name?: string;
            username?: string;
            email?: string;
            isVerify?: boolean;
            isAcceptingMessages?: boolean;
            image?: string;
        }
    }

}