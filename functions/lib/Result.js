"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.err = exports.succ = void 0;
exports.succ = (data) => ({
    isErr: false,
    data,
});
exports.err = (err) => ({
    isErr: true,
    err,
});
//# sourceMappingURL=result.js.map