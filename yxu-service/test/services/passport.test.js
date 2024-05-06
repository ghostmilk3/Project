// NOT WORK YET. Since Jest does not support .mock in esm before version 27.
// https://github.com/facebook/jest/issues/10025

// import { password } from "../../src/services/passport.js";
// import { jest } from "@jest/globals";
// import { error } from "../../src/services/response.js";

// let res = {};
// let next = jest.fn();
// jest.mock("../../src/services/response.js", () => {
//     return {
//         error: jest.fn()
//     };
// });

// describe("Password middleware tests", () => {
//     let req = { headers: {} };

//     beforeEach(() => {
//         req.headers = { tenant: "TenantA" };
//     });

//     it("I should see 400 response when I pass not tenant in headers.", () => {
//         req.headers.tenant = undefined;
//         password()(req, res, next);
//         expect(error).toBeCalledWith(res, 400, "Please provide tenant information in the request headers.");
//     });
// });