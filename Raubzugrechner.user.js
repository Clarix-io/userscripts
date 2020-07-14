// ==UserScript==
// @name         Raubzugrechner
// @namespace    https://clarix.io
// @version      0.1
// @description  try to take over the world!
// @author       Clarix
// @match        https://*.die-staemme.de/game.php?village=*&screen=place&mode=scavenge
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var debug = true;

    $('<div class="action-container"><center><a href="#" class="btn btn-default" id="CalcTroops" style="margin-top: 0.5em";>Kalkulieren</a></center></div>').insertAfter('.candidate-squad-widget');
    $('#CalcTroops').click(() => {
        var result = Calculate();
        $('#Result').remove();
        $('#ShowInPopup').remove();
        $('<div id="Result" style="margin-top: 0.5em";>Effizienteste Verteilung:<br><textarea name="TroopResult" cols="40" rows="2" disabled>' + result.r1 + '\r\n' + result.r2 + '\r\n' + result.r3 + '</textarea></div><div class="action-container"><center><a href="#" class="btn btn-default" id="ShowInPopup" style="margin-top: 0.5em";>In neuem Fenster</a></center></div>').insertAfter('#CalcTroops');
        $('#ShowInPopup').click(() => {
            var w = window.open();
            var html = $("#Result").html();

            $(w.document.body).html(html);
        });
    });
    var i = 0;
    for (var x = 15;x <= 40;x++)
    {
        i++;
    }

    console.log('I: ' + i);


    function Calculate() {
        var troops = [];
        var maxCapacity = 0;
        var stage1 = 0, stage2 = 0, stage3 = 0;

        troops.spear = countUnits('spear');
/*         troops.spear = 110; */
        troops.sword = countUnits('sword')
/*         troops.sword = 100; */
        troops.axe = countUnits('axe')
        troops.archer = countUnits('archer')
        troops.light = countUnits('light')
/*         troops.light = 100; */
        troops.marcher = countUnits('marcher')
        troops.heavy = countUnits('heavy')
        troops.knight = countUnits('knight')
        if(debug){console.log(troops)}

        maxCapacity = troops.spear * 25 + troops.sword * 15 + troops.axe * 10 + troops.light * 80 + troops.heavy * 50;
        if(debug){console.log("Gesamtkapazität: " + maxCapacity);}
        var a1 = 0;
        var a2 = 0;
        var a3 = 0;

        var end = 0;
        for (var x1 = 15; x1 <= 40; x1++) {
//             console.log('From x1: ' + x1 + ' - ' + x2 + ' - ' + x3)
            var x2 = 15;
            for (x2 = 15; x2 <= 40; x2++) {
//                 console.log('From x2: ' + x1 + ' - ' + x2 + ' - ' + x3)
                var x3 = 15;
                for (x3 = 15; x3 <= 40; x3++) {
//                     console.log('From x3: ' + x1 + ' - ' + x2 + ' - ' + x3)
                    if (x1 + x2 + x3 == 100) {
                        var loot1 = maxCapacity * x1 * 0.2 / 100;
                        var loot2 = maxCapacity * x2 * 0.25 / 100;
                        var loot3 = maxCapacity * x3 * 0.5 / 100;

                        var wert1 = loot1 * (24*60*60/((loot1 ^ 0.9) * (100 ^ 0.45) + 1800))
                        var wert2 = loot2 * (24*60*60/((loot2 ^ 0.9) * (100 ^ 0.45) + 1800))
                        var wert3 = loot3 * (24*60*60/((loot3 ^ 0.9) * (100 ^ 0.45) + 1800))

                        var gesamtloot = loot1 + loot2 + loot3
                        var gesamtwert = wert1 + wert2 + wert3

                        if (gesamtwert >= end) {
                            console.log('HIT! Gesamtwert: ' + gesamtwert + ' End: ' + end)
                            end = gesamtwert;
                            a1 = x1;
                            a2 = x2;
                            a3 = x3;
                        }
                    }
                }
            }
        }

        var result = [];
        result.r1 = "Stufe 1: " + parseInt(troops.spear * a1 / 100) + " / " + parseInt(troops.sword * a1 / 100) + " / " + parseInt(troops.axe * a1 / 100) + " / " + parseInt(troops.light * a1 / 100) + " / " + parseInt(troops.heavy * a1 / 100);
        result.r2 = "Stufe 2: " + parseInt(troops.spear * a2 / 100) + " / " + parseInt(troops.sword * a2 / 100) + " / " + parseInt(troops.axe * a2 / 100) + " / " + parseInt(troops.light * a2 / 100) + " / " + parseInt(troops.heavy * a2 / 100);
        result.r3 = "Stufe 3: " + parseInt(troops.spear * a3 / 100) + " / " + parseInt(troops.sword * a3 / 100) + " / " + parseInt(troops.axe * a3 / 100) + " / " + parseInt(troops.light * a3 / 100) + " / " + parseInt(troops.heavy * a3 / 100);

//         console.log('ende: ' + end);

        if(debug){console.log(result.r1);}
        if(debug){console.log(result.r2);}
        if(debug){console.log(result.r3);}

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

