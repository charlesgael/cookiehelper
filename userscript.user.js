// ==UserScript==
// @name Cookie Monster
// @namespace CGD
// @include http://orteil.dashnet.org/cookieclicker/
// @include https://orteil.dashnet.org/cookieclicker/
// @version 1
// @author cdjedai
// @description A set of tools for cookieclicker by orteil
// @grant none
// ==/UserScript==

var code = "(" + (function() {
    function Monster() {
        this._autogolden = null;
        this._autoclicker = null;
    }

    // Spawn golden
    Monster.prototype.spawnGolden = function() {
        Game.shimmer.time = Game.shimmer.maxTime;
    }

    // Autogolden
    Monster.prototype.autogolden = function() {
        if (!this._autogolden) {
            setInterval(function() {
                Game.shimmers.forEach(function(shimmer) {
                    if (shimmer.type == "golden" && shimmer.wrath == 0) { shimmer.pop() }
                });
            }, 500);
        }
        else {
            console.error('Autogolden already started');
        }
    }
    Monster.prototype.stopgolden = function() {
        if (this._autogolden) {
            clearInterval(this._autogolden);
            this._autogolden = null;
        }
        else {
            console.error('No autoclicker started');
        }
    }

    // Autoclicker
    Monster.prototype.autoclicker = function() {
        if (!this._autoclicker) {
            this._autoclicker = setInterval(Game.ClickCookie, 1);
        }
        else {
            console.error('Autoclicker already started');
        }
    }
    Monster.prototype.stopclicker = function() {
        if (this._autoclicker) {
            clearInterval(this._autoclicker);
            this._autoclicker = null;
        }
        else {
            console.error('No autoclicker started');
        }
    }

    // Unlock upgrades
    Monster.prototype.upgrades = function() {
        var refresh = false;
        if (Game.cookieClicks < 1000000 || Game.handmadeCookies < 1000000) {
            Game.cookieClicks += 1000000;
            Game.handmadeCookies += 1000000;
            refresh = true;
            console.log('- clicks to 1000000');
        }
        if (Game.goldenClicksLocal < 1) {
            (new Game.shimmer('golden',{noWrath:true})).pop();
            refresh = true;
            console.log('- golden clicks to 1');
        }

        if (missingUpgrades()) {
            console.log('- has missing upgrades');
            refresh = true;
        }

        if (refresh) {
            Game.storeToRefresh = 1;
            Game.upgradesToRebuild = 1;
        }
        else {
            console.log('nothing to do');
        }
    }

    function missingUpgrades() {
        var refresh = false;
        var available = Game.Upgrades;
        var ownedCookies = Game.cookieUpgrades;
        var cookiesList = [
            // Christmas
            'Christmas tree biscuits',
            'Snowflake biscuits',
            'Snowman biscuits',
            'Holly biscuits',
            'Candy cane biscuits',
            'Bell biscuits',
            'Present biscuits',
            // Garden
            'Elderwort biscuits',
            'Bakeberry cookies',
            'Duketater cookies',
            'Green yeast digestives',
            'Wheat slims',
'Fern tea',
'Ichor syrup',
            // Valentine
            'Pure heart biscuits',
            'Ardent heart biscuits',
            'Sour heart biscuits',
            'Weeping heart biscuits',
            'Golden heart biscuits',
            'Eternal heart biscuits',
            // Halloween
            'Skull cookies',
            'Ghost cookies',
            'Bat cookies',
            'Slime cookies',
            'Pumpkin cookies',
            'Eyeball cookies',
            'Spider cookies',
            // Easter
            'Chicken egg',
            'Duck egg',
            'Turkey egg',
            'Quail egg',
            'Robin egg',
            'Ostrich egg',
            'Cassowary egg',
            'Salmon roe',
            'Frogspawn',
            'Shark egg',
            'Turtle egg',
            'Ant larva',
            'Golden goose egg',
            'Faberge egg',
            'Wrinklerspawn',
            'Cookie egg',
            'Omelette',
            'Chocolate egg',
            'Century egg',
            '"egg"'
        ];

        console.group('Missing upgrades');

        cookiesList.forEach(c=>{
            if (Game.Upgrades[c]) {
                Game.Unlock(c);
                refresh = true;
            }
            else {
                console.error('Upgrade not existing:', c);
            }
        });

        console.groupEnd();

        return refresh;
    }

    function makeUi() {
        addStyle();
        var topBar = document.getElementById('topBar');
        topBar.append(sectionAutoclick());
        topBar.append(sectionAutogolden());
    }

    function sectionAutoclick() {
        var el = document.createElement('div');
        var label = document.createElement('label');
        label.innerText = 'Auto click';
        label.htmlFor = 'autoclick_checkbox';
        el.append(label);
        el.append(createPillBox('autoclick_checkbox', function(){
            if (this.checked) {
                window.monster.autoclicker();
            }
            else {
                window.monster.stopclicker();
            }
        }));
        return el;
    }

    function sectionAutogolden() {
        var el = document.createElement('div');
        var label = document.createElement('label');
        label.innerText = 'Auto golden';
        label.htmlFor = 'autoclick_golden';
        el.append(label);
        el.append(createPillBox('autoclick_golden', function(){
            if (this.checked) {
                window.monster.autogolden();
            }
            else {
                window.monster.stopgolden();
            }
        }));
        return el;
    }

    function createPillBox(id, change) {
        var el = document.createElement('div');
        el.className = 'pillbox';
        var box = document.createElement('input');
        box.type = 'checkbox';
        box.id = id;
        var label = document.createElement('label');
        label.htmlFor = id;
        el.append(box);
        el.append(label);
        if (change) box.addEventListener('change', change);
        return el;
    }

    var checkReady = setInterval(function() {
        if (typeof Game.ready !== 'undefined' && Game.ready) {
            Game.LoadMod('https://aktanusa.github.io/CookieMonster/CookieMonster.js');
            window.monster = new Monster();
            makeUi();
            clearInterval(checkReady);
        }
    }, 1000);

    function addStyle() {
        GM_addStyle(`
/**
 * Checkbox Three
 */
.pillbox {
    width: 70px;
    height: 21px;
    background: #333;
    margin: -2px 6px;

    border-radius: 20px;
    position: relative;
    display: inline-block
}

/**
 * Start by hiding the checkboxes
 */
.pillbox input[type=checkbox] {
    visibility: hidden;
}

/**
 * Create the text for the On position
 */
.pillbox:before {
    content: 'On';
    position: absolute;
    top: 5px;
    left: 5px;
    height: 2px;
    font-size: 12px;
    color: #26ca28;
}

/**
 * Create the label for the off position
 */
.pillbox:after {
    content: 'Off';
    position: absolute;
    top: 6px;
    right: 7px;
    height: 2px;
    color: #111;
    font-size: 12px;
    color: #fff
}

/**
 * Create the pill to click
 */
.pillbox label {
    display: block;
    width: 30px;
    height: 11px;
    border-radius: 50px;

    transition: all .5s ease;
    cursor: pointer;
    position: absolute;
    top: 5px;
    z-index: 1;
    left: 6px;
    background: #ddd;
}

/**
 * Create the checkbox event for the label
 */
.pillbox input[type=checkbox]:checked + label {
    left: 34px;
    background: #26ca28;
}
`);
        function GM_addStyle(style) {
            var css = document.createElement('style');
            css.type = 'text/css';

            if (css.styleSheet)
                css.styleSheet.cssText = style;
            else
                css.appendChild(document.createTextNode(style));

            document.getElementsByTagName('head')[0].appendChild(css);
        }
    }
}).toString() + ")()";

window.eval(code);
