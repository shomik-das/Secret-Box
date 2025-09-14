import 'next-auth';

declare module 'next-auth' {
    interface User {
        _id?: string;
        username?: string;
        email?: string;
        password?: string;
        isVerifying?: boolean;
        isAcceptingMessages?: boolean;
    }
    interface Session {
        user: {
            _id?: string;
            username?: string;
            email?: string;
            isVerifying?: boolean;
            isAcceptingMessages?: boolean;
        } & DefaultSession['user'];
    }
    interface JWT {
        _id?: string;
        username?: string;
        email?: string;
        isVerifying?: boolean;
        isAcceptingMessages?: boolean;
    }

}