"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaxUser = void 0;
const universal_authenticator_library_1 = require("universal-authenticator-library");
const UALWaxError_1 = require("./UALWaxError");
class WaxUser extends universal_authenticator_library_1.User {
    constructor(chain, userAccount, pubKeys, wax) {
        super();
        this.accountName = userAccount;
        this.pubKeys = pubKeys;
        this.requestPermission = 'active';
        this.chain = chain;
        this.wax = wax;
        // compatible features
        this.api = wax.api;
        this.rpc = wax.api && wax.api.rpc;
    }
    /**
     * @param transaction  The transaction to be signed (a object that matches the RpcAPI structure).
     * @param options  Options for tapos fields
     */
    async signTransaction(transaction, options) {
        try {
            const account = await this.wax.login();
            if (account !== this.accountName) {
                throw new Error('Account does not match the requested permission');
            }
            else {
                this.api = this.wax.api;
                this.rpc = this.wax.api.rpc;
            }
            const completedTransaction = await this.wax.api.transact(transaction, options);
            return this.returnEosjsTransaction(options.broadcast !== false, completedTransaction);
        }
        catch (e) {
            throw new UALWaxError_1.UALWaxError(e.message ? e.message : 'Unable to sign transaction', universal_authenticator_library_1.UALErrorType.Signing, e);
        }
    }
    async signArbitrary() {
        throw new UALWaxError_1.UALWaxError('WAX Cloud Wallet does not currently support signArbitrary', universal_authenticator_library_1.UALErrorType.Unsupported, null);
    }
    async verifyKeyOwnership() {
        throw new UALWaxError_1.UALWaxError('WAX Cloud Wallet does not currently support verifyKeyOwnership', universal_authenticator_library_1.UALErrorType.Unsupported, null);
    }
    async getAccountName() {
        return this.accountName;
    }
    async getChainId() {
        return this.chain.chainId;
    }
    async getKeys() {
        return this.pubKeys;
    }
}
exports.WaxUser = WaxUser;
