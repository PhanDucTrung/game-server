export interface Account {
    username: string;
    password: string;
    email?: string;
    nickname?: string;
    age?: number;
}
export declare class UsersService {
    private filePath;
    private readAccounts;
    private writeAccounts;
    findUser(username: string): Account | undefined;
    addUser(username: string, password: string): boolean;
    updateUser(username: string, updates: Partial<Account>): boolean;
    validate(username: string, password: string): boolean;
}
