"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upperCaseWord = upperCaseWord;
function upperCaseWord(address) {
    if (!address)
        return address;
    try {
        let [line1, town, county, postcode] = address.split("<br>");
        let newAddress = "";
        if (line1)
            line1 = line1.charAt(0).toUpperCase() + line1.slice(1);
        if (town)
            town = town.charAt(0).toUpperCase() + town.slice(1);
        if (county)
            county = county.charAt(0).toUpperCase() + county.slice(1);
        if (postcode)
            postcode = postcode.toUpperCase();
        if (!postcode.includes(" ")) {
            postcode = postcode.slice(0, 3) + " " + postcode.slice(3);
        }
        newAddress = [line1, town, county, postcode].filter(Boolean).join("<br>");
        return newAddress;
    }
    catch (err) {
        return address;
    }
}
