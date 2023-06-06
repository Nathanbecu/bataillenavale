const alphabet = {0: "X", 1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "F", 7: "G", 8: "H", 9: "I", 10: "J"}
const state = ["pending", "touched", "drowned", "missed", "drownedBoat"];
let boatsConf = [5, 4, 4, 3, 2];
let boatsConfOriginal = [5, 4, 4, 3, 2];
let drownedBoats = [];
let mapObject = {
    cases: []
};

// const boatsConf = [3]

function initializeMap($carte) {
    let html = "";

    for (let i = 0; i < 11; i++) {
        html += "<div class='ligne'>";
        for (let j = 0; j < 11; j++) {
            html += "<div class='case' data-col='" + j + "' data-row='" + i + "'";
            if (j === 0) {
                html += " data-legende='true'>" + alphabet[i];
            } else if (i === 0) {
                html += " data-legende='true'>" + j;
            } else {
                html += "data-game='true' >";
            }
            html += "</div>";
            if (j > 0 && i > 0) {
                mapObject.cases.push({
                    "col": j,
                    "row": i,
                    "state": "pending",
                    "probabilitie": 0
                })
            }

        }
        html += "</div>"
    }

    $carte.html(html);
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function getKeyByRow($case) {
    return parseInt(getKeyByValue(alphabet, $case.data('row')));
}

function getOtherBoatOnRow($case, index) {
    return $('[data-row="' + $case.data('row') + '"][data-col="' + index + '"]');
}

function getOtherBoatOnCol($case, index) {
    return $('[data-row="' + index + '"][data-col="' + $case.data('col') + '"]')
}

function getState($case) {
    return $case.data("state");
}

// function calculateProbabilitie($case, boat, boatLength, direction) {
//
//     let offset;
//     let index;
//     let otherBoat;
//     let probabilite = 0;
//     let boatObject = findCaseObject(parseInt($case.data('col')), parseInt($case.data('row')))
//
//     if (["North", "South"].includes(direction)) {
//         offset = parseInt($case.data('row'))
//         index = parseInt(offset) + boatLength;
//         otherBoat = getOtherBoatOnCol($case, index)
//     } else {
//         offset = parseInt($case.data('col'))
//         index = parseInt(offset) + boatLength;
//         otherBoat = getOtherBoatOnRow($case, index)
//     }
//
//     if (
//         otherBoat.length !== 0 &&
//         otherBoat.data("game") === true &&
//         !["missed", "drowned"].includes(boatObject.state)
//     )
//     {
//         let indexCopy = index;
//         if (["North", "West"].includes(direction)) {
//             while (indexCopy < offset) {
//                 let otherCase;
//                 if (direction === "North") {
//                     otherCase = findCaseObject(boatObject.col, indexCopy);
//                 } else {
//                     otherCase = findCaseObject(indexCopy, boatObject.row);
//                 }
//                 switch (otherCase.state) {
//                     case "pending" :
//                         if (probabilite < 2) {
//                             probabilite = 1;
//                         }
//                         break;
//                     case "missed" :
//                     case "drowned" :
//                     case "drownedBoat" :
//                         probabilite = 0;
//                         indexCopy = 99999;
//                         break;
//                     case "touched" :
//                         probabilite += 5;
//                         break;
//                 }
//
//                 indexCopy += 1;
//             }
//         } else {
//             while (indexCopy > offset) {
//                 let otherCase;
//                 if (direction === "South") {
//                     otherCase = findCaseObject(boatObject.col, indexCopy);
//                 } else {
//                     otherCase = findCaseObject(indexCopy, boatObject.row);
//                 }
//                 switch (otherCase.state) {
//                     case "pending" :
//                         if (probabilite < 2) {
//                             probabilite = 1;
//                         }
//                         break;
//                     case "missed" :
//                     case "drowned" :
//                     case "drownedBoat" :
//                         probabilite = 0;
//                         indexCopy = 0;
//                         break;
//                     case "touched" :
//                         probabilite += 5;
//                         break;
//                 }
//                 indexCopy -= 1;
//             }
//         }
//     }
//
//     boatObject.probabilitie += probabilite;
// }

function calculateProbabilitie($case, boat, boatLength, direction) {

    let offset;
    let index;
    let otherBoat;
    let boatObject = findCaseObject(parseInt($case.data('col')), parseInt($case.data('row')))
    let arrayBoat = []

    if (["North", "South"].includes(direction)) {
        offset = parseInt($case.data('row'))
        index = parseInt(offset) + boatLength;
        otherBoat = getOtherBoatOnCol($case, index)
    } else {
        offset = parseInt($case.data('col'))
        index = parseInt(offset) + boatLength;
        otherBoat = getOtherBoatOnRow($case, index)
    }

    if (
        otherBoat.length !== 0 &&
        otherBoat.data("game") === true &&
        !["missed", "drowned"].includes(boatObject.state)
    ) {
        let indexCopy = index;
        if (["North", "West"].includes(direction)) {
            while (indexCopy < offset) {
                let otherCase;
                if (direction === "North") {
                    otherCase = findCaseObject(boatObject.col, indexCopy);
                } else {
                    otherCase = findCaseObject(indexCopy, boatObject.row);
                }
                switch (otherCase.state) {
                    case "pending" :
                    case "touched" :
                        arrayBoat.push(otherCase)
                        break;
                    case "missed" :
                    case "drowned" :
                    case "drownedBoat" :
                        indexCopy = 99999;
                        break;
                }

                indexCopy += 1;
            }
        } else {
            while (indexCopy > offset) {
                let otherCase;
                if (direction === "South") {
                    otherCase = findCaseObject(boatObject.col, indexCopy);
                } else {
                    otherCase = findCaseObject(indexCopy, boatObject.row);
                }
                switch (otherCase.state) {
                    case "pending" :
                    case "touched" :
                        arrayBoat.push(otherCase)
                        break;
                    case "missed" :
                    case "drowned" :
                    case "drownedBoat" :
                        indexCopy = 0;
                        break;
                }
                indexCopy -= 1;
            }
        }

        if (arrayBoat.length === boat.boatLength) {
            if (arrayBoat.find(el => el.state === "touched")) {
                arrayBoat.forEach((item) => {
                    findCaseObject(item.col, item.row).probabilitie += 5;
                })
            } else {
                arrayBoat.forEach((item) => {
                    console.log(findCaseObject(item.col, item.row))
                    findCaseObject(item.col, item.row).probabilitie += 1;
                })
            }
        }
    }
}

function calculProbabilite($case, boatLength) {

    let boat = {
        boatLength: boatLength - 1,
    }

    calculateProbabilitie($case, boat, -Math.abs(boat.boatLength), "North");
    calculateProbabilitie($case, boat, boat.boatLength, "South");
    calculateProbabilitie($case, boat, -Math.abs(boat.boatLength), "West");
    calculateProbabilitie($case, boat, boat.boatLength, "East");
}

function calculProbabilites() {
    mapObject.cases.forEach((item) => {
        item.probabilitie = 0
    })
    let $casesToProcess = $('[data-game="true"]');

    $casesToProcess.each((index, item) => {
        let $case = $(item);

        boatsConf.forEach((boat) => {
            calculProbabilite($case, boat);
        })
    })
}

function findCaseHTML(col, row) {
    return $('[data-row="' + row + '"][data-col="' + col + '"]');
}

function findCaseObject(col, row) {
    return mapObject.cases.find(el => el.col === col && el.row === row)
}

function shoot(target) {
    console.log()
    let $caseShooted = $(target.currentTarget);
    let caseToShoot = findCaseObject($caseShooted.data("col"), $caseShooted.data("row"))

    switch (caseToShoot.state) {
        case "pending" :
            caseToShoot.state = "missed";
            $caseShooted.css("background-color", "black")
            break;
        case "missed" :
            caseToShoot.state = "touched";
            $caseShooted.css("background-color", "blue")
            $caseShooted.css("color", "blue")
            break;
        case "touched" :
            caseToShoot.state = "drowned";
            $caseShooted.css("background-color", "green")
            $caseShooted.css("color", "green")
            $caseShooted.off('click')
            break;
    }

    calculProbabilites()
    gradientMap()
}

function gradientMap() {
    let casesObject = [];
    let casesHTML = [];

    mapObject.cases.forEach(function (caseObject) {
        if (caseObject.state === "pending") {
            casesObject.push(caseObject.probabilitie)
            casesHTML.push(findCaseHTML(caseObject.col, caseObject.row))
        }
    })

    let min = Math.min(...casesObject);
    let max = Math.max(...casesObject);
    let maxPonderate = max - min;

    if (max !== Infinity && min !== -Infinity) {
        casesHTML.forEach((caseHTML) => {
            let caseObject = findCaseObject(caseHTML.data('col'), caseHTML.data('row'))
            let caseProbablitie = caseObject.probabilitie

            caseProbablitie -= min;

            if (caseProbablitie !== 0) {
                caseProbablitie = Math.round((caseProbablitie * (100 / maxPonderate)) * 10) / 10
            } else {
                caseProbablitie = 0.1;
            }

            caseHTML.html(caseProbablitie)
            caseHTML.css('background-color', 'rgb(255,0,0,' + caseProbablitie / 100 + ')')
        })
    }

    $("#boatConf").html(JSON.stringify(boatsConf))
}

function checkSameLine(cases) {
    let line = 0
    for (let caseObject of cases) {
        if (line === 0) {
            line = caseObject.row;
        } else if (line !== caseObject.row) {
            return false;
        }
    }

    return true
}

function checkSameCol(cases) {
    let col = 0
    for (let caseObject of cases) {
        if (col === 0) {
            col = caseObject.col;
        } else if (col !== caseObject.col) {
            return false;
        }
    }

    return true
}

function checkConsecutive(cases) {
    let rowOffsets = []
    let isRowConsecutives = true;
    let colOffsets = []
    let isColConsecutives = true;
    cases.forEach(function (item) {
        rowOffsets.push(item.row)
        colOffsets.push(item.col)
    })

    rowOffsets.sort()
    colOffsets.sort()


    for (let i = 1; i < rowOffsets.length; i++) {
        if (rowOffsets[i] !== rowOffsets[i - 1] + 1) {
            isRowConsecutives = false;
        }
    }

    for (let j = 1; j < colOffsets.length; j++) {
        if (colOffsets[j] !== colOffsets[j - 1] + 1) {
            isColConsecutives = false;
        }
    }
    return (isColConsecutives || isRowConsecutives)

}

function drown() {
    let drownedCases = mapObject.cases.filter(el => el.state === "drowned")
    let sameLine = checkSameLine(drownedCases);
    let sameRow = checkSameCol(drownedCases);

    if (
        drownedCases.length >= Math.min(...boatsConf) &&
        drownedCases.length <= Math.max(...boatsConf) &&
        checkConsecutive(drownedCases) &&
        (sameLine || sameRow)
    ) {
        let index = boatsConf.indexOf(drownedCases.length);
        if (index !== -1) {
            boatsConf.splice(index, 1);
        }

        drownedBoats.push(drownedCases);

        if (boatsConf === []) {
            endTheGame();
        } else {
            drownedCases.forEach(function (item) {
                findCaseObject(item.col, item.row).state = "drownedBoat"
                findCaseHTML(item.col, item.row).html("x")
            })

            calculProbabilites()
            gradientMap()
        }
    }
}

function endTheGame() {
    $.post({
        url: "http://localhost/bataillenavale/api/GamesAPI.php",
        data: {
            "action": "saveGame",
            "game": {
                "boatConf": boatsConfOriginal,
                "boats": drownedBoats
            }
        },
        success: function () {

        }
    })
}

function resetDrowned() {
    mapObject.cases.forEach((item) => {
        if (item.state === "drowned") {
            item.state = "missed"

            let caseHtml = findCaseHTML(item.col, item.row)
            caseHtml.click((event) => {
                shoot(event)
            })
            caseHtml.click()
        }
    })
}

$(document).ready(() => {
    const $carte = $("#carte");

    initializeMap($carte);
    calculProbabilites();
    gradientMap();

    $("#drown").click(function () {
        drown()
    });

    $("#resetDrowned").click(function () {
        resetDrowned();
    })

    $('[data-legende="true"]').css("border", "2px red solid");

    $('[data-game="true"]').click((event) => {
        shoot(event);
    })
})