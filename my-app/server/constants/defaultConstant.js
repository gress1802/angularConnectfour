const Token = require('../models/token');
const Theme = require('../models/theme');

var alexiaURL = 'https://media.licdn.com/dms/image/C4E03AQEDil9gumwe8A/profile-displayphoto-shrink_100_100/0/1636642322101?e=1681948800&v=beta&t=XM3EVz7Z33rpMrwhHHcdiAjeVikpU_vGKPOMKOhYzHg';
var demarcusURL = 'https://media.licdn.com/dms/image/C5603AQGrAzvcFeFcGQ/profile-displayphoto-shrink_100_100/0/1628650461769?e=1681948800&v=beta&t=ki_cwLOZw6uaz-hffWZOrfUAfnAEtSN11eqMq0Pux2M';
var alexiaToken = new Token('Alexia', alexiaURL);
var demarcusToken = new Token('Demarcus', demarcusURL);
var defaultTheme = new Theme('#E66465', alexiaToken, demarcusToken);
class DefaultConstant {
    constructor() {
        this.defaultTheme = defaultTheme;
    }
}

module.exports = DefaultConstant;