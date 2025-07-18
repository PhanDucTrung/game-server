"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
class Account {
    constructor(data) {
        this.username = data.username ?? '';
        this.password = data.password ?? '';
        this.email = data.email ?? '';
        this.nickname = data.nickname ?? this.username;
        this.age = data.age ?? null;
    }
}
exports.Account = Account;
//# sourceMappingURL=account.model.js.map