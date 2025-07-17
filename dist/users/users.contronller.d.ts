import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(body: {
        username: string;
        password: string;
    }): {
        status: string;
        message: string;
        user?: undefined;
    } | {
        status: string;
        user: import("./users.service").Account;
        message?: undefined;
    };
    login(body: {
        username: string;
        password: string;
    }): {
        status: string;
        user: import("./users.service").Account;
        message?: undefined;
    } | {
        status: string;
        message: string;
        user?: undefined;
    };
    update(body: {
        username: string;
        updates: Partial<{
            password: string;
            email: string;
            nickname: string;
            age: number;
        }>;
    }): {
        status: string;
        message: string;
        user?: undefined;
    } | {
        status: string;
        user: import("./users.service").Account;
        message?: undefined;
    };
}
