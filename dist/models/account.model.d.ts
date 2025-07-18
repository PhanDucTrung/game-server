export declare class Account {
    username: string;
    password: string;
    email?: string;
    nickname?: string;
    age?: number;
    constructor(data: Partial<Account>);
}
