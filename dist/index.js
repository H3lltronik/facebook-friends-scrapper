"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer = require("puppeteer-extra");
var StealthPlugin = require("puppeteer-extra-plugin-stealth");
var friends_1 = require("./friends");
var instances_1 = require("./instances");
var logger_1 = require("./logger");
puppeteer.use(StealthPlugin());
var url = "https://www.facebook.com/";
var profileUrl = "https://www.facebook.com/esau.gonzalezsoto";
var nameSearch = "Helen De Anda Salmerón";
var wait = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, rootPage, pageFound, rootProfiles, foundInProfiles, index, _i, rootProfiles_1, profile, page, pageFound_1, results, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, logger_1.log)("Starting process")];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, instances_1.getBrowser)()];
            case 2:
                browser = _a.sent();
                return [4 /*yield*/, browser.pages()];
            case 3:
                rootPage = (_a.sent())[0];
                return [4 /*yield*/, blockResources(rootPage)];
            case 4:
                _a.sent();
                return [4 /*yield*/, rootPage.goto(url, { waitUntil: "networkidle2" })];
            case 5:
                _a.sent();
                return [4 /*yield*/, login(rootPage)];
            case 6:
                _a.sent();
                return [4 /*yield*/, goToFriendsPage(rootPage, profileUrl)];
            case 7:
                pageFound = _a.sent();
                if (!!pageFound) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, logger_1.log)("Could not find the friends page of ".concat(profileUrl))];
            case 8:
                _a.sent();
                return [2 /*return*/];
            case 9: return [4 /*yield*/, (0, friends_1.retrieveFriends)(rootPage)];
            case 10:
                rootProfiles = _a.sent();
                return [4 /*yield*/, (0, logger_1.log)("Found ".concat(rootProfiles.length, " profiles"))];
            case 11:
                _a.sent();
                foundInProfiles = [];
                index = 0;
                _a.label = 12;
            case 12:
                _a.trys.push([12, 28, , 32]);
                _i = 0, rootProfiles_1 = rootProfiles;
                _a.label = 13;
            case 13:
                if (!(_i < rootProfiles_1.length)) return [3 /*break*/, 27];
                profile = rootProfiles_1[_i];
                if (!(index > 0)) return [3 /*break*/, 15];
                return [4 /*yield*/, (0, logger_1.log)("---------------------------------")];
            case 14:
                _a.sent();
                _a.label = 15;
            case 15: return [4 /*yield*/, (0, logger_1.log)("Searching ".concat(profile.name, ", number ").concat(++index, " of ").concat(rootProfiles.length))];
            case 16:
                _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 17:
                page = _a.sent();
                return [4 /*yield*/, blockResources(page)];
            case 18:
                _a.sent();
                return [4 /*yield*/, goToFriendsPage(page, profile.url)];
            case 19:
                pageFound_1 = _a.sent();
                if (!!pageFound_1) return [3 /*break*/, 21];
                return [4 /*yield*/, (0, logger_1.log)("Could not find the friends page of ".concat(profile.name))];
            case 20:
                _a.sent();
                page.close();
                return [3 /*break*/, 26];
            case 21: return [4 /*yield*/, (0, friends_1.friendsSearch)(page, nameSearch)];
            case 22:
                results = _a.sent();
                if (!results) return [3 /*break*/, 25];
                return [4 /*yield*/, (0, logger_1.log)(JSON.stringify(results), { prettyPrint: true })];
            case 23:
                _a.sent();
                return [4 /*yield*/, (0, logger_1.saveToFile)(results, true)];
            case 24:
                _a.sent();
                foundInProfiles.push(profile);
                _a.label = 25;
            case 25:
                page.close();
                _a.label = 26;
            case 26:
                _i++;
                return [3 /*break*/, 13];
            case 27: return [3 /*break*/, 32];
            case 28:
                error_1 = _a.sent();
                return [4 /*yield*/, (0, logger_1.log)("The process failed at index ".concat(index), { type: logger_1.LOG_TYPES.ERROR })];
            case 29:
                _a.sent();
                return [4 /*yield*/, (0, logger_1.log)("Saved calculated profiles to file")];
            case 30:
                _a.sent();
                return [4 /*yield*/, (0, logger_1.saveToFile)(foundInProfiles, true)];
            case 31:
                _a.sent();
                return [3 /*break*/, 32];
            case 32: return [4 /*yield*/, (0, logger_1.log)("Profiles that have ".concat(nameSearch, " as a friend:"))];
            case 33:
                _a.sent();
                return [4 /*yield*/, (0, logger_1.log)(JSON.stringify(foundInProfiles), { prettyPrint: true })];
            case 34:
                _a.sent();
                return [4 /*yield*/, wait(10000)];
            case 35:
                _a.sent();
                return [4 /*yield*/, browser.close()];
            case 36:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var login = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.type("#email", "soybarney666@hotmail.com")];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.type("#pass", "SPARTAN1998")];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.click("button[name='login']")];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.waitForNetworkIdle()];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var checkNotPageFound = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    var contentUnavailable;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.evaluate(function () {
                    var spans = Array.from(document.querySelectorAll("span"));
                    return spans.some(function (span) {
                        return span.innerText.includes("Este contenido no está disponible en este momento");
                    });
                })];
            case 1:
                contentUnavailable = _a.sent();
                return [2 /*return*/, contentUnavailable];
        }
    });
}); };
var blockResources = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.setRequestInterception(true)];
            case 1:
                _a.sent();
                page.on("request", function (request) {
                    // block all unnecessary requests
                    if (request.resourceType() === "image" ||
                        request.resourceType() === "stylesheet" ||
                        request.resourceType() === "font" ||
                        request.resourceType() === "media" ||
                        request.resourceType() === "websocket") {
                        request.abort();
                    }
                    else {
                        request.continue();
                    }
                });
                return [2 /*return*/];
        }
    });
}); };
var goToFriendsPage = function (page, profileUrl) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.goto("".concat(profileUrl, "/friends"), { waitUntil: "networkidle2" })];
            case 1:
                _a.sent();
                return [4 /*yield*/, checkNotPageFound(page)];
            case 2:
                if (!_a.sent()) return [3 /*break*/, 4];
                return [4 /*yield*/, page.goto("".concat(profileUrl, "&sk=friends"), {
                        waitUntil: "networkidle2",
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, checkNotPageFound(page)];
            case 5:
                if (_a.sent())
                    return [2 /*return*/, false];
                return [2 /*return*/, true];
        }
    });
}); };
main();
