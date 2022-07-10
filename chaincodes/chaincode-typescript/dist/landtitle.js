"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandTitle = void 0;
/* eslint-disable new-cap */
/* eslint-disable max-len */
const fabric_contract_api_1 = require("fabric-contract-api");
let LandTitle = class LandTitle {
};
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "docType", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "landTitleId", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "province", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "district", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "town", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "sizeInSquareMetres", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "landUse", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "owner", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "ownerIdNumber", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "transferToName", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "transferToID", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "tradingStatus", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "appraisedValue", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "dateOfTitleIssue", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "txId", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "identityOfCreator", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], LandTitle.prototype, "dateOfEditing", void 0);
LandTitle = __decorate([
    (0, fabric_contract_api_1.Object)()
], LandTitle);
exports.LandTitle = LandTitle;
//# sourceMappingURL=landtitle.js.map