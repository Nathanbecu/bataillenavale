const alphabet = {0: "X", 1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "F", 7: "G", 8: "H", 9: "I", 10: "J"}
const state = ["pending", "touched", "drowned", "missed"];
const boatsConf = [5, 4, 4, 3, 2]
// const boatsConf = [2]

function initializeMap($carte) {
    let html = "";

    for (let i = 0; i < 11; i++) {
        html += "<div class='ligne'>";
        for (let j = 0; j < 11; j++) {
            html += "<div class='case' data-col='" + j + "' data-row='" + alphabet[i] + "' data-state='pending'";
            if (j === 0) {
                html += " data-legende='true'>" + alphabet[i];
            } else if (i === 0) {
                html += " data-legende='true'>" + j;
            } else {
                html += "data-game='true' >";
            }
            html += "</div>";
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
    return $('[data-row="' + alphabet[index] + '"][data-col="' + $case.data('col') + '"]')
}

function getState($case) {
    return $case.data("state");
}

function calculProbabilite($case, boat) {
    // boat -= 1;

    let probabiliteNorth = 0;
    let probabiliteSouth = 0;
    let probabiliteWest = 0;
    let probabiliteEast = 0;

    const indexNorth = getKeyByRow($case) - boat;
    const indexSouth = getKeyByRow($case) + boat;
    const indexWest = parseInt($case.data('col')) - boat;
    const indexEast = parseInt($case.data('col')) + boat;

    const boatNorth = getOtherBoatOnCol($case, indexNorth)
    const boatSouth = getOtherBoatOnCol($case, indexSouth)
    const boatWest = getOtherBoatOnRow($case, indexWest)
    const boatEast = getOtherBoatOnRow($case, indexEast)

    //NORD
    if (boatNorth.length !== 0 && boatNorth.data("game") === true) {
        let indexNorthCopy = indexNorth;
        while (indexNorthCopy < getKeyByRow($case)) {
            indexNorthCopy += 1;
            let otherCase = getOtherBoatOnCol($case, indexNorthCopy);
            if ($case.get(0) !== otherCase.get(0)) {
                let state = getState(otherCase);
                switch (state) {
                    case "pending" :
                        probabiliteNorth = 1;
                        break;
                    case "missed" :
                    case "drowned" :
                        probabiliteNorth = 0;
                        indexNorthCopy = 99999;
                        break;
                    case "touched" :
                        probabiliteNorth += 5;
                        break;
                }
            } else {
                probabiliteNorth = 0;
                indexNorthCopy = 99999;
            }
        }
    }

    //SUD
    if (boatSouth.length !== 0 && boatSouth.data("game") === true) {
        let indexSouthCopy = indexSouth;
        while (indexSouthCopy > getKeyByRow($case)) {
            indexSouthCopy -= 1;
            let otherCase = getOtherBoatOnCol($case, indexSouthCopy);
            if ($case.get(0) !== otherCase.get(0)) {
                let state = getState(otherCase);
                switch (state) {
                    case "pending" :
                        probabiliteSouth = 1;
                        break;
                    case "missed" :
                    case "drowned" :
                        probabiliteSouth = 0;
                        indexSouthCopy = 0;
                        break;
                    case "touched" :
                        probabiliteSouth += 5;
                        break;
                }
            }
        }
    }

    //OUEST
    if (boatWest.length !== 0 && boatWest.data("game") === true) {
        let indexWestCopy = indexWest;
        while (indexWestCopy < parseInt($case.data('col'))) {
            indexWestCopy += 1;
            let otherCase = getOtherBoatOnRow($case, indexWestCopy);
            if ($case.get(0) !== otherCase.get(0)) {
                let state = getState(otherCase);
                switch (state) {
                    case "pending" :
                        probabiliteWest = 1;
                        break;
                    case "missed" :
                    case "drowned" :
                        probabiliteWest = 0;
                        indexWestCopy = 99999;
                        break;
                    case "touched" :
                        probabiliteWest += 5;
                        break;
                }
            } else {
                probabiliteWest = 0;
                indexWestCopy = 99999;
            }
        }
    }

    //NORD
    if (boatEast.length !== 0 && boatEast.data("game") === true) {
        let indexEastCopy = indexEast;
        while (indexEastCopy > parseInt($case.data('col'))) {
            indexEastCopy -= 1;
            let otherCase = getOtherBoatOnRow($case, indexEastCopy);
            if ($case.get(0) !== otherCase.get(0)) {
                let state = getState(otherCase);
                switch (state) {
                    case "pending" :
                        probabiliteEast = 1;
                        break;
                    case "missed" :
                    case "drowned" :
                        probabiliteEast = 0;
                        indexEastCopy = 0;
                        break;
                    case "touched" :
                        probabiliteEast += 5;
                        break;
                }
            } else {
                probabiliteEast = 0;
                indexEastCopy = 0;
            }
        }
    }
    // console.log(probabiliteNorth , probabiliteSouth , probabiliteWest , probabiliteEast)
    return probabiliteNorth + probabiliteSouth + probabiliteWest + probabiliteEast;
}

function calculProbabilites($carte) {
    let $casesToProcess = $('[data-game="true"]');

    $casesToProcess.each((index, item) => {
        let $case = $(item);
        let probabiliteCase = 0;
        boatsConf.forEach((boat) => {
            probabiliteCase += calculProbabilite($case, boat);
        })
        $case.html(probabiliteCase)
    })
}

function shoot(target) {
    let $caseToShoot = $(target.currentTarget);
    $caseToShoot.data("state", "missed");
    console.log($caseToShoot)
    calculProbabilites($("#carte"))

}

$(document).ready(() => {
    const $carte = $("#carte");

    initializeMap($carte);
    calculProbabilites($carte);

    $('[data-legende="true"]').css("border", "2px red solid");

    $('[data-game="true"]').click((event) => {
        shoot(event);
    })
})