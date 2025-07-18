"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const account_model_1 = require("../models/account.model");
let UsersService = class UsersService {
    constructor() {
        this.filePath = path.join(__dirname, '../../data/accounts.json');
    }
    readAccounts() {
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, '[]');
        }
        const data = fs.readFileSync(this.filePath, 'utf8');
        const raw = JSON.parse(data);
        return raw.map(a => new account_model_1.Account(a));
    }
    writeAccounts(accounts) {
        fs.writeFileSync(this.filePath, JSON.stringify(accounts, null, 2), 'utf8');
    }
    findUser(username) {
        const accounts = this.readAccounts();
        return accounts.find(acc => acc.username === username);
    }
    addUser(username, password) {
        const accounts = this.readAccounts();
        if (accounts.find(acc => acc.username === username)) {
            return false;
        }
        accounts.push(new account_model_1.Account({
            username,
            password,
            email: '',
            nickname: username,
            age: null,
        }));
        this.writeAccounts(accounts);
        return true;
    }
    updateUser(username, updates) {
        const accounts = this.readAccounts();
        const user = accounts.find(acc => acc.username === username);
        if (!user)
            return false;
        Object.assign(user, updates);
        this.writeAccounts(accounts);
        return true;
    }
    validate(username, password) {
        const accounts = this.readAccounts();
        return accounts.some(acc => acc.username === username && acc.password === password);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map