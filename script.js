const NUMERIC_SUFFIX = [  "",   "k",   "m",   "b",    "t",   "qd",   "qt",   "sx",   "sp",   "oc",   "no",
                                "de", "ude", "dde", "tde", "qdde", "qtde", "sxde", "spde", "ocde", "node",
                                "vt", "uvt", "dvt", "tvt", "qdvt", "qtvt", "sxvt", "spvt", "ocvt", "novt",
                                "tg", "utg", "dtg", "ttg", "qdtg", "qttg", "sxtg", "sptg", "octg", "notg",
                                "qd", "uqd", "dqd", "tqd", "qdqd", "qtqd", "sxqd", "spqd", "ocqd", "noqd",
                                "qg", "uqg", "dqg", "tqg", "qdqg", "qtqg", "sxqg", "spqg", "ocqg", "noqg",
                                "sg", "usg", "dsg", "tsg", "qdsg", "qtsg", "sxsg", "spsg", "ocsg", "nosg",
                                "st", "ust", "dst", "tst", "qdst", "qtst", "sxst", "spst", "ocst", "nost",
                                "og", "uog", "dog", "tog", "qdog", "qtog", "sxog", "spog", "ocog", "noog",
                                "ng", "ung", "dng", "tng", "qdng", "qtng", "sxng", "spng", "ocng", "nong",
                                "ce", "uce",
],
        RARITY_INDEX = ["common", "unusual", "rare", "epic", "legendary", "mythic",  "ultra",    "super",   "celestial",         "chaos",         "effulgent"],
        CORRES_VALUE = [       1,         5,     50,     500,      10000,   500000, 50000000, 5000000000, 1000000000000, 500000000000000, 1000000000000000000]

let is_visible = false


// copied from my unused bot
COL_COMMON = ["#7EEF6D"]
COL_UNUSUAL = ["#FFE65D"]
COL_RARE = ["#4D52E3"]
COL_EPIC = ["#861FDE"]
COL_LEGENDARY = ["#DE1F1F"]
COL_MYTHIC = ["#1FDBDD"]
COL_ULTRA = ["#FF2B75"]
COL_SUPER = ["#2BFFA3"]

C_COMMON = COL_COMMON[0]
C_UNUSUAL = COL_UNUSUAL[0]
C_RARE = COL_RARE[0]
C_EPIC = COL_EPIC[0]
C_LEGENDARY = COL_LEGENDARY[0]
C_MYTHIC = COL_MYTHIC[0]
C_ULTRA = COL_ULTRA[0]
C_SUPER = COL_SUPER[0]

arr_of_cols = [C_COMMON, C_UNUSUAL, C_RARE, C_EPIC, C_LEGENDARY, C_MYTHIC, C_ULTRA, C_SUPER]
arr_of_dcols = ["#49E831", "#FFDC1B", "#2127D5", "#6D19B4", "#B41919", "#19B1B3" , "#F10054", "#00F189"] //darkened colours (19%)
probabilities = [0.64, 0.32, 0.16, 0.08, 0.04, 0.02, 0.01, 0.005]

function round(x, a) {
    return 10**a*Math.round(x/10**a)
}

function f(x) {
    return Number((20*(Math.floor((2*x)*1.05**(2*x-1))+Math.floor((2*x+1)*1.05**(2*x)))).toPrecision(2))
}

function calculate_function(x, c, a) {
    let fail = (1 - c) / 4;
    let current = 5;
    let pad = 0;
    const arr = [null, [1], [0], [0], [0], [0]];
    while (current <= x){
        arr.shift();
        while (arr[0][0] < a){
            for (let i = 0; i < 5; i++)
                arr[i].shift();
            pad++;
        }
        while (arr[0][-1] < a)
            arr[0].pop();
        const temp_arr = [];
        for (let i = 0; i < arr[0].length + 1; i++)
            temp_arr.push(0);
        arr.push(temp_arr);
        let i = 0;
        for (let j = 0; j < arr[0].length; j++) {
            const val = arr[0][j];
            for (let k = 0; k < 5; k++)
                arr[k][i] += val*fail;
            arr[5][i+1] += val*c;
            i++;
        }
        current += 1;
    }
    arr.shift();
    const final = [];
    for (let i = 0; i < pad; i++)
        final.push(0);
    for (let i = 0; i < 4; i++)
        arr[i].push(0);
    for (let i = 0; i < arr[4].length; i++){
        let sum = 0;
        for (let j = 0; j < 5; j++)
            sum += arr[j][i];
        final.push(sum);
    }
    return final;
}

function calculate_func(){
    const canv = document.getElementById('crafting_result');
    canv.remove();
    let newcanv = document.createElement("canvas");
    newcanv.id = "crafting_result";
    document.getElementById('graph_container').appendChild(newcanv); // to prevent canvases from overlaping
    let ri = document.getElementById("crafting_rarity").value;
    let c = probabilities[ri];
    let x = document.getElementById("crafting_amount").value;
    let acc = 10**(0-document.getElementById("crafting_accuracy_magnitude").value)
    if (x < 5 && 0 <= c <= 1){
        alert("The amount of petals or the probability in craft must be legit.");
        return;
    }
    if (x > 1000000){
        alert("You cannot have more than 1,000,000 petals of the same type and rarity at the same, therefore I will not calculate >:)\n");
        return;
    }
    if (x >= 100000)
        alert("Warning: The amount of crafting is too large, the result may take very long to get.");
    else if (x >= 10000 && acc < 10e-30)
        alert("Warning: The result is unnecessary accurate and may take long to calculate.");
    let message_text = document.getElementById("crafting_message_text");
    let message = "If your screen freeze, reload the page or wait for the result."
    message_text.innerText = message;
    setTimeout(function(){}, 100);
    const r = calculate_function(x, c, acc);
    let a = 0;
    for (let i = 0; i < r.length; i++) {
        a += r[i] * i;
    }
    let pad = 0;
    for (let i = 0; i < r.length; i++)
        if (r[i] < 10e-5)
            pad++;
        else
            break;
    const xv = [];
    const yv = [];
    let i = pad;
    while (i < r.length) {
        if (r[i] < 10e-5)
                break;
        xv.push(i);
        yv.push(r[i] * 100);
        i++;
    }
    // Add percentage symbol to y-axis ticks and tooltips
    new Chart("crafting_result", {
        type: "bar",
        data: {
            labels: xv,
            datasets: [{
                backgroundColor: arr_of_cols[ri-0+1],
                hoverBackgroundColor: arr_of_dcols[ri-0+1],
                data: yv
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return Number(context.parsed.y.toFixed(5)) + '%';
                        }
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
    message_text.innerText = "" + x + " " + RARITY_INDEX[ri] + " petals, " + a.toPrecision(5) + " average successful attempts.";
    craft_sim();
}

function craft_sim(){
    if (document.getElementById("crafting_amount").value > 1000000) {
        alert("You are killing your computer, just stop ;-;\nReload the page to unfreeze the website.");
    }
    let ri = document.getElementById("crafting_rarity").value;
    let c = probabilities[ri];
    let x = document.getElementById("crafting_amount").value;
    let x1 = x;
    let s = 0;
    while (x >= 5)
        if (Math.random() < c) {
            x -= 5;
            s++;
        } else
            x -= Math.floor(Math.random()*4)+1;
    let out = document.getElementById("crafting_sim_text");
    out.innerText = "Simulation result: from " + x1 + " " + RARITY_INDEX[ri] + " petals, " + s + " succeeded attempts, " + x + " remains.";
}

function XP_calculate(level) {
    if (level <= 0) {
        alert("Error: Level must be positive, right?");
    } 
    else if (level == 1) return 15;
    else if (level == 2) return 210;
    else if (level > 7137) return Infinity;
    else {
        return f(level);
    }
}

function numeric_to_string(number, digit) {
    // get digits
    if (number <= 0) return 0
    if (number === Infinity) return undefined
    len = Math.floor(Math.log10(number)) + 1
    suffix = Math.floor((len-1)/3)
    modified = number.toPrecision(digit)  // ???
    string = Math.round(modified/(10**(3*suffix))*100)/100 + NUMERIC_SUFFIX[suffix]
    return string
}

function on_calculate_XP() {
    if (Number(document.getElementById("level_input").value) <= 0) {
        alert("Error: Level must be positive, right?")
        return;
    }
    if (XP_calculate(Number(document.getElementById("level_input").value)) <= Number(document.getElementById("XP_input").value)) {
        alert("You cannot have that much XP at level " + document.getElementById("level_input").value + "!")
        return
    }
    let XP = Number(document.getElementById("petal_input").value),
        level = Number(document.getElementById("level_input").value),
        rXP =  Number(document.getElementById("XP_input").value)
    if (rXP < 0) {
        alert("Your current XP must be nonnegative, right?")
        return
    }
    let invalid = false
    if (XP < 0) {invalid = true; XP = -XP}
    if (invalid ^ (document.getElementById("XP_calculate_type").value == "after")) {
        XP+=rXP
        while (XP-XP_calculate(level) >= 0) {
            XP-=XP_calculate(level)
            level++
        }
    } else {
        rXP -= XP
        while (rXP < 0) {
            level--;
            if (level == 0) {
                alert("Error: Level gone below 1.");
                return;
            }
            XP=XP_calculate(level)
            rXP += XP
        }
        XP = rXP
    }
    document.getElementById("XP_result").innerText = "Level " + level + ": " + XP + "/" + numeric_to_string(XP_calculate(level), 2) + " (" + numeric_to_string(XP, 3) + ", " + (XP/XP_calculate(level)*100).toPrecision(4) + "%)"
    return
}

function Extension_toggle() {
    obj = document.getElementsByClassName("extensions")
    for (let i = 0; i < obj.length; i++) {
        if (is_visible) {
            obj[i].style = "display: none"
            rename_btns("XPAND")
        } else {
            obj[i].style = ""
            rename_btns("COLLAPSE")
        }
    }
    is_visible = !is_visible
}

function rename_btns(string_rename) {
    btns = document.getElementsByClassName("button_toggle")
    for (let i = 0; i < btns.length; i++) {
        btns[i].innerText = string_rename
    }
}

function numeric_to_string_(number) {
    return number + " (" + numeric_to_string(number, 3) + ")"
}

function level_difference() {
    let level1 = Number(document.getElementById("a_level_input").value),
        level2 = Number(document.getElementById("b_level_input").value),
        xp1 = Number(document.getElementById("a_XP_input").value),
        xp2 = Number(document.getElementById("b_XP_input").value);
    if (level1 <= 0 || level2 <= 0) {
        alert("Error: Level must be positive, right?")
        return
    }
    if (xp1 < 0 || xp2 < 0) {
        alert("Error: XP must be nonnegative, right?")
        return
    }
    let output = 0;
    // case 1: levels are equal
    if (level1 == level2) {
        output = abs(xp1 - xp2);
    } else {
        // case 2: levels are not equal
        if (level1 > level2) {
            let temp = level1;
            level1 = level2;
            level2 = temp;
            temp = xp1;
            xp1 = xp2;
            xp2 = temp;
        }
        output += XP_calculate(level1) - xp1;
        level1++;
        while (level1 < level2) {
            output += XP_calculate(level1);
            level1++;
        }
        output += xp2;
    }
    document.getElementById("xp_dif").innerText = numeric_to_string_(output);
}
