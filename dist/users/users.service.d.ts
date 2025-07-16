export declare class UsersService {
    findUser(username: string): {
        username: string;
        password: string;
        email: string;
        nickname: string;
        age: number;
    };
    addUser(username: string, password: string): void;
}
