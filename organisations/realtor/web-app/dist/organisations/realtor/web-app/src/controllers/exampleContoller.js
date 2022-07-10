"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.about = exports.eg = void 0;
const eg = (req, res) => {
    // variable with some data to send to views and partials
    const mascots = [
        { name: 'Sammy', organization: 'DigitalOcean', birth_year: 2012 },
        { name: 'Tux', organization: 'Linux', birth_year: 1996 },
        { name: 'Moby Dock', organization: 'Docker', birth_year: 2013 },
    ];
    const tagLine = 'No programming concept is complete without a cute animal mascot.';
    res.render('pages/eg', {
        mascots,
        tagLine,
    });
};
exports.eg = eg;
const about = (req, res) => {
    res.render('pages/about');
};
exports.about = about;
