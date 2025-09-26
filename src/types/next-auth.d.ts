import 'next-auth';

declare module 'next-auth' {
    interface User {
        _id?: string;
        username?: string;
        email?: string;
        password?: string;
        isVerify?: boolean;
        isAcceptingMessages?: boolean;
        image?: string;
    }
    interface Session {
        user: {
            _id?: string;
            username?: string;
            email?: string;
            isVerify?: boolean;
            isAcceptingMessages?: boolean;
            image?: string;
        } & DefaultSession['user'];
    }
    interface JWT {
        _id?: string;
        username?: string;
        email?: string;
        isVerify?: boolean;
        isAcceptingMessages?: boolean;
        image?: string;
    }

}