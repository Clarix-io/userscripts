// ==UserScript==
// @name         Raubzugrechner
// @namespace    https://clarix.io
// @version      0.4
// @description  try to take over the world!
// @author       Clarix
// @updateURL    https://github.com/Clarix-io/userscripts/raw/master/Raubzugrechner.user.js
// @downloadURL  https://github.com/Clarix-io/userscripts/raw/master/Raubzugrechner.user.js
// @match        https://*.die-staemme.de/game.php?village=*&screen=place&mode=scavenge
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var debug = true;

    $('<div class="action-container"><center><a href="#" class="btn btn-default" id="CalcTroops" style="margin-top: 0.5em";>Kalkulieren (Effizienz)</a><a href="#" class="btn btn-default" id="CalcTroopsTime" style="margin-top: 0.5em";>Kalkulieren (Zeit)</a></center></div>').insertAfter('.candidate-squad-widget');
    $('#CalcTroops').click(() => {
        var result = Calculate();
        $('#Result').remove();
        $('#ShowInPopup').remove();
        $('<div id="Result" style="margin-top: 0.5em";>Effizienteste Verteilung:<br><textarea name="TroopResult" cols="40" rows="3" disabled>' + result.r1 + '\r\n' + result.r2 + '\r\n' + result.r3 + '\r\n' + result.r4 + '</textarea></div><div class="action-container"><center><a href="#" class="btn btn-default" id="ShowInPopup" style="margin-top: 0.5em";>In neuem Fenster</a></center></div>').insertAfter('#CalcTroopsTime');
        $('#ShowInPopup').click(() => {
            var w = window.open();
            var html = $("#Result").html();

            $(w.document.body).html(html);
        });
    });
    $('#CalcTroopsTime').click(() => {
        var result = CalculateForTime();
        $('#Result').remove();
        $('#ShowInPopup').remove();
        $('<div id="Result" style="margin-top: 0.5em";>Zeitoptimierte Verteilung:<br><textarea name="TroopResult" cols="40" rows="3" disabled>' + result.r1 + '\r\n' + result.r2 + '\r\n' + result.r3 + '\r\n' + result.r4 + '</textarea></div><div class="action-container"><center><a href="#" class="btn btn-default" id="ShowInPopup" style="margin-top: 0.5em";>In neuem Fenster</a></center></div>').insertAfter('#CalcTroopsTime');
        $('#ShowInPopup').click(() => {
            var w = window.open();
            var html = $("#Result").html();

            $(w.document.body).html(html);
        });
    });

    function Calculate() {
        var troops = [];
        var maxCapacity = 0;
        var stage1 = 0, stage2 = 0, stage3 = 0;

        troops.spear = countUnits('spear');
/*         troops.spear = 600; */
        troops.sword = countUnits('sword')
/*         troops.sword = 300; */
        troops.axe = countUnits('axe')
        troops.archer = countUnits('archer')
        troops.light = countUnits('light')
/*         troops.light = 200; */
        troops.marcher = countUnits('marcher')
        troops.heavy = countUnits('heavy')
        troops.knight = countUnits('knight')
        if(debug){console.log(troops)}

        // Needs to be adapted with marcher, archer etc. for eff run!
        maxCapacity = troops.spear * 25 + troops.sword * 15 + troops.axe * 10 + troops.light * 80 + troops.heavy * 50;
        if(debug){console.log("Gesamtkapazität: " + maxCapacity);}
        var a1 = 0;
        var a2 = 0;
        var a3 = 0;
        var a4 = 0;
        var end = 0;

        for (var x1 = 15; x1 <= 40; x1++) {
//             console.log('From x1: ' + x1 + ' - ' + x2 + ' - ' + x3)
            var x2 = 15;
            for (x2 = 15; x2 <= 40; x2++) {
//                 console.log('From x2: ' + x1 + ' - ' + x2 + ' - ' + x3)
                var x3 = 15;
                for (x3 = 15; x3 <= 40; x3++) {
                    var x4 = 15;
                    for (x4 = 15; x4 <= 40; x4++) {
                        //                     console.log('From x3: ' + x1 + ' - ' + x2 + ' - ' + x3)
                        if (x1 + x2 + x3 + x4 == 100) {
                            var loot1 = maxCapacity * x1 * 0.1 / 100;
                            var loot2 = maxCapacity * x2 * 0.25 / 100;
                            var loot3 = maxCapacity * x3 * 0.5 / 100;
                            var loot4 = maxCapacity * x4 * 0.75 / 100;

                            var wert1 = loot1 * (24*60*60/(Math.pow(loot1, 0.9) * Math.pow(100, 0.45) + 1800))
                            var wert2 = loot2 * (24*60*60/(Math.pow(loot2, 0.9) * Math.pow(100, 0.45) + 1800))
                            var wert3 = loot3 * (24*60*60/(Math.pow(loot3, 0.9) * Math.pow(100, 0.45) + 1800))
                            var wert4 = loot4 * (24*60*60/(Math.pow(loot4, 0.9) * Math.pow(100, 0.45) + 1800))

                            var gesamtloot = loot1 + loot2 + loot3 + loot4
                            var gesamtwert = wert1 + wert2 + wert3 + wert4

                            if (gesamtwert >= end) {
                                console.log('HIT! Gesamtwert: ' + gesamtwert + ' End: ' + end)
                                end = gesamtwert;
                                a1 = x1;
                                a2 = x2;
                                a3 = x3;
                                a4 = x4;
                            }
                        }
                    }
                }
            }
        }

        var result = [];
        result.r1 = "Stufe 1: " + parseInt(troops.spear * a1 / 100) + " | " + parseInt(troops.sword * a1 / 100) + " | " + parseInt(troops.axe * a1 / 100) + " | " + parseInt(troops.light * a1 / 100) + " | " + parseInt(troops.heavy * a1 / 100);
        result.r2 = "Stufe 2: " + parseInt(troops.spear * a2 / 100) + " | " + parseInt(troops.sword * a2 / 100) + " | " + parseInt(troops.axe * a2 / 100) + " | " + parseInt(troops.light * a2 / 100) + " | " + parseInt(troops.heavy * a2 / 100);
        result.r3 = "Stufe 3: " + parseInt(troops.spear * a3 / 100) + " | " + parseInt(troops.sword * a3 / 100) + " | " + parseInt(troops.axe * a3 / 100) + " | " + parseInt(troops.light * a3 / 100) + " | " + parseInt(troops.heavy * a3 / 100);
        result.r4 = "Stufe 4: " + parseInt(troops.spear * a4 / 100) + " | " + parseInt(troops.sword * a4 / 100) + " | " + parseInt(troops.axe * a4 / 100) + " | " + parseInt(troops.light * a4 / 100) + " | " + parseInt(troops.heavy * a4 / 100);

//         console.log('ende: ' + end);

        if(debug){console.log(result.r1);}
        if(debug){console.log(result.r2);}
        if(debug){console.log(result.r3);}
        if(debug){console.log(result.r4);}

        return result;
    }

    function CalculateForTime() {
        var troops = [];
        var maxCapacity = 0;
        var stage1 = 0.5767, stage2 = 0.23, stage3 = 0.1155, stage4 = 0.077;

        troops.spear = countUnits('spear');
/*         troops.spear = 600; */
        troops.sword = countUnits('sword')
/*         troops.sword = 300; */
        troops.axe = countUnits('axe')
        troops.archer = countUnits('archer')
        troops.light = countUnits('light')
/*         troops.light = 200; */
        troops.marcher = countUnits('marcher')
        troops.heavy = countUnits('heavy')
        troops.knight = countUnits('knight')
        if(debug){console.log(troops)}

        var result = [];
        result.r1 = "Stufe 1: " + parseInt(troops.spear * stage1) + " | " + parseInt(troops.sword * stage1) + " | " + parseInt(troops.axe * stage1) + " | " + parseInt(troops.archer * stage1) + " | " + parseInt(troops.light * stage1) + " | " + parseInt(troops.marcher * stage1) + " | " + parseInt(troops.heavy * stage1);
        result.r2 = "Stufe 2: " + parseInt(troops.spear * stage2) + " | " + parseInt(troops.sword * stage2) + " | " + parseInt(troops.axe * stage2) + " | " + parseInt(troops.archer * stage2) + " | " + parseInt(troops.light * stage1) + " | " + parseInt(troops.marcher * stage1) + " | " + parseInt(troops.heavy * stage2);
        result.r3 = "Stufe 3: " + parseInt(troops.spear * stage3) + " | " + parseInt(troops.sword * stage3) + " | " + parseInt(troops.axe * stage3) + " | " + parseInt(troops.archer * stage3) + " | " + parseInt(troops.light * stage1) + " | " + parseInt(troops.marcher * stage1) + " | " + parseInt(troops.heavy * stage3);
        result.r4 = "Stufe 4: " + parseInt(troops.spear * stage4) + " | " + parseInt(troops.sword * stage4) + " | " + parseInt(troops.axe * stage4) + " | " + parseInt(troops.archer * stage4) + " | " + parseInt(troops.light * stage1) + " | " + parseInt(troops.marcher * stage1) + " | " + parseInt(troops.heavy * stage4);

//         console.log('ende: ' + end);

        if(debug){console.log(result.r1);}
        if(debug){console.log(result.r2);}
        if(debug){console.log(result.r3);}
        if(debug){console.log(result.r4);}

        return result;
    }

    function removeBrackets(text) {
        return String(text).replace(/\(|\)/g, '');
    }

    function countUnits(unit) {
        return parseInt(removeBrackets($('[data-unit="' + unit + '"]')[1].text));
    }

    function nWin() {
        var w = window.open();
        var html = $("#toNewWindow").html();

        $(w.document.body).html(html);
    }
})();

