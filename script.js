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
        RARITY_INDEX = ["common", "unusual", "rare", "epic", "legendary", "mythic",  "ultra",    "super",      "unique"],
        CORRES_VALUE = [       1,         5,     50,     500,      10000,   500000, 50000000, 5000000000, 1000000000000]

function update_ADVANCED_MODE() {
    document.querySelectorAll(".advanced_mode").forEach(function(element) {
        if (ADVANCED_MODE) {
            element.style.display = "table-row";
        } else {
            element.style.display = "none";
        }
    });
}

window.last_answer_craft = null;
window.valid_petal = []; // [id, name]
window.petal_data = []
// help
window.onload = () => {
    let v = fetch("p.json");
    v.then(response => response.json()).then(data => {
        for (let i = 1; i < data.length; i++) {
            if (typeof data[i][0] === 'number' && !isNaN(data[i][0]))
                window.valid_petal.push([data[i][0], data[i][1]]);
        }
        let selectors = document.getElementsByClassName("petal_type");
        for (let i = 0; i < selectors.length; i++) {
            for (let j = 0; j < window.valid_petal.length; j++) {
                let option = document.createElement("option");
                option.value = window.valid_petal[j][0];
                option.text = window.valid_petal[j][1];
                selectors[i].appendChild(option);
            }
        }
        window.petal_data = data;
    });
}

const ii = [false,]

let is_visible = false
let ADVANCED_MODE = false
function ADVANCED_MODE_toggle() {
    ADVANCED_MODE = !ADVANCED_MODE
    const adv = document.getElementById("advanced_mode");
    if (ADVANCED_MODE) {
        document.getElementById("advanced_mode_btn").innerText = "Disable advanced mode";
    } else {
        document.getElementById("advanced_mode_btn").innerText = "Enable advanced mode";
    }
    update_ADVANCED_MODE();
}

const _ = [0]

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

function new_graph(id, labels, data, color, dcolor) {
    const canv = document.getElementById(id);
    if (canv) {
        canv.remove();
    }
    let newcanv = document.createElement("canvas");
    newcanv.id = id;
    document.getElementById('graph_container').appendChild(newcanv); // to prevent canvases from overlapping
        new Chart(id, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: color,
                hoverBackgroundColor: dcolor,
                data: data
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
}

function on_petal_change(index) {
    let img = document.getElementById("petal_img" + index);
    if (document.getElementById("petal_type" + index).value >= 0)
        img.src = "https://raw.githubusercontent.com/Furaken/florr.io/main/image/1_normal/petal/" + RARITY_INDEX[(document.getElementById("petal_rarity" + index).value)] + "/" + window.petal_data[(document.getElementById("petal_type" + index).value)][2] +".png";
    else
        img.src = "https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png";
}

// TODO: modifiers
function be_real(index, d) {
    let type = document.getElementById("petal_type" + index).value;
    let rarity = document.getElementById("petal_rarity" + index).value;
    if (type < 0)
        return Array(0);
    const data = window.petal_data[type][3][rarity];
    let c = Math.abs(data[0]);
    if (c === 0)
        return Array(0);
    let q;
    if (d === true && c < 0)
        q = 1;
    else
        q = 0;
    const p = data.slice(1);
    // modifiers here
    return p.flatMap(e => Array(Math.abs(c) + q).fill(e));
}

function get_value(petal_id, rarity, key) {
    try {
        return window.petal_data[petal_id][3][rarity][key];
    } catch (_) {
        return null;
    }
}

function use(x) {
    if (!isFinite(x)) return 0;
    return x-0;
}

const T = 25;

// TODO: DPS
function calculate_dps() {
    const petal_base = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(e => [document.getElementById("petal_type" + e).value-0, document.getElementById("petal_rarity" + e).value-0]);
    // Get environmental variables
    let _theta = document.getElementById("dps_theta").value-0;
    let M_d = document.getElementById("dps_M_d").value-0;
    let M_a = document.getElementById("dps_M_a").value-0;
    /* unimplemented */ let M_dl = 0.0;
    /* unimplemented */ let M_e = 0.0;
    /* unimplemented */ let P_e = 0.0;
    let E_fi = document.getElementById("dps_E_fi").value-0;
    let Dp = document.getElementById("dps_Dp").value;
    let R = document.getElementById("dps_R").value-0;
    // Update state (petal-petal)
    let B = 0  // will change
    // Unpack to apply, also changes the variables
    const petal_particles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].flatMap(e => be_real(e, Dp).map(x => (typeof x === 'object' && x !== null) ? structuredClone(x) : x));
    console.log(petal_particles);
    for (let i = 0; i < petal_particles.length; i++){
        P = petal_particles[i];
        if (!(P["t"][0] === "n" || P["t"][0] === "s")) continue; // not
        if (use(P["h"]) <= 0){ 
            P["h"] = 0;
            continue; // dead
        }
        if (use(P["d"]) <= 0) 
            P["d"] = 0; // no damage
        else 
            P["d"] = Math.max(0.0, use(P["d"]) + B - M_a)*(1 - M_e); // existing transformations are all linear
        P["h"] = Math.ceil(use(P["h"])/(Math.max(M_d - use(P["a"]), 0) + M_dl))/(1 - P_e)
    }
    let dps_type_a = 0.0;
    // Calculate DPS using petal_list
    for (let i = 0; i < petal_particles.length; i++) {
        let THAT = 2*Math.PI/_theta*Math.ceil((Math.floor((R*P["h"])/(T*_theta))+R*P["c"]+R*E_fi)/2/Math.PI)
        console.log(THAT);
        // TODO: Implement DPS calculation
        if (P["h"] === Infinity){
            // special handling
            let dps = P["d"]*T*_theta/2/Math.PI;
            dps_type_a += dps;
            continue;
        } else if (P["h"] <= 0) {
            // no health, no DPS
            continue;
        }
        // Not tomato and variant:
        if (P["t"][0] === "n") {
            let dps = R * P["d"] * P["h"] / THAT;
            dps_type_a += dps;
        }
        // Is tomato:
        else if (P["t"][0] === "s") {
            // incomplete
            continue;
        }
    }
    return dps_type_a;
}

function calculate_dps_btn() {
    let dps = calculate_dps();
    document.getElementById("dps_result").innerText = "DPS: " + dps.toPrecision(10);
}

function calculate_func(){
    const canv = document.getElementById('crafting_result');
    canv.remove();
    let newcanv = document.createElement("canvas");
    newcanv.id = "crafting_result";
    document.getElementById('graph_container').appendChild(newcanv); // to prevent canvases from overlaping
    let ri = document.getElementById("crafting_rarity").value;
    let c = document.getElementById("crafting_custom_probability").value;
    let custom_chance = true;
    if (c <= 0 || c >= 100){
        c = probabilities[ri];
        custom_chance = false;
    }
    else c /= 100;
    let rarity_name = document.getElementById("crafting_custom_name").value;
    if (rarity_name === "") rarity_name = RARITY_INDEX[ri];
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
    // colors
    let color_ = document.getElementById("crafting_custom_bar_color1").value;
    let color_2 = color_;
    if (color_ === "#000000")
        color_ = document.getElementById("crafting_custom_bar_color2").value;
        color_2 = color_;
    if (color_ === "#000000" || color_ === "" || color_ === "black"){
        color_ = arr_of_cols[ri-0+1];
        color_2 = arr_of_dcols[ri-0+1];
    }
    // Add percentage symbol to y-axis ticks and tooltips
    new_graph("crafting_result", xv, yv, color_, color_2);
    message_text.innerText = "" + x + " " + rarity_name + " petals, " + Math.round((a + Number.EPSILON) * 100) / 100 + " average successful attempts.";
    craft_sim();
}

function craft_sim(){
    let ri = document.getElementById("crafting_rarity").value;
    let x = document.getElementById("crafting_amount").value-0;
    let c = document.getElementById("crafting_custom_probability").value;
    let custom_chance = true;
    if (c <= 0 || c >= 100){
        c = probabilities[ri];
        custom_chance = false;
    }
    else c /= 100;
    let rarity_name = document.getElementById("crafting_custom_name").value;
    if (rarity_name === "") rarity_name = RARITY_INDEX[ri];
    let x1 = x;
    let s = 0;
    while (x >= 5)
        if (Math.random() < c) {
            x -= 5;
            s++;
        } else
            x -= Math.floor(Math.random()*4)+1;
    let out = document.getElementById("crafting_sim_text");
    out.innerText = "Simulation result: from " + x1 + " " + rarity_name + " petals, " + s + " succeeded attempts, " + x + " remains.\nFast approximation: " + Math.round(((x1-2.5*(1-c))/(2.5/c+2.5)+Number.EPSILON)*100)/100 + " succeeded attempts.";
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

function padEnd_replace(str, len, char) {
    if (str.length >= len) return str;
    let padding = char.repeat(len - str.length);
    return str + padding;
}

function numeric_to_string(number) {
    // get digits
    let len;
    if (number <= 0) return 0
    if (number === Infinity) return 'Too much, cannot handle'
    let str = number.toString();
    if (str.includes("e")) {
        let parts = str.split("e");
        str = parts[0];
        len = parseInt(parts[1]) + 1;
        str = str.replace(".", "");
        str = padEnd_replace(str, len, "0");
    } else {
        len = str.length;
    }
    let suffix = Math.floor((len-1)/3);
    if (len <= 3) return str;
    if (len % 3 == 0) {
        str = str.slice(0, 3);
    } else {
        str = str.slice(0, len % 3) + "." + str.slice(len % 3, 3);
        let p = 3;
        while (!![]) {
            if (str[p] == "0") {
                str = str.slice(0, p);
                p--;
                continue;
            }
            if (str[p] == ".") {
                str = str.slice(0, p);
                break;
            }
            break;
        }
    }
    return str + NUMERIC_SUFFIX[suffix];
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
    document.getElementById("XP_result").innerText = "Level " + level + ": " + XP + "/" + numeric_to_string(XP_calculate(level)) + " (" + numeric_to_string(XP) + ", " + (XP/XP_calculate(level)*100).toPrecision(4) + "%)"
    return
}

function Extension_toggle() {
    obj = document.getElementsByClassName("extensions")
    for (let i = 0; i < obj.length; i++) {
        if (is_visible) {
            obj[i].style = "display: none"
            rename_btns("EXPAND")
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
    return number + " (" + numeric_to_string(number) + ")"
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
    let temp = 0;
    // case 1: levels are equal
    if (level1 == level2) {
        output = Math.abs(xp1 - xp2);
        temp = level1;
    } else {
        // case 2: levels are not equal
        if (level1 > level2) {
            temp = level1;
            level1 = level2;
            level2 = temp;
            temp = level1
            let temp2 = xp1;
            xp1 = xp2;
            xp2 = temp2;
        }
        output += XP_calculate(level1) - xp1;
        level1++;
        while (level1 < level2) {
            output += XP_calculate(level1);
            level1++;
        }
        output += xp2;
    }
    let table_str = ""
    for (let s = temp; s <= level2; s++) {
        let new_str = "Level " + s + ": " + numeric_to_string_(XP_calculate(s));
        table_str = table_str.concat(new_str, "\n");
    }
    console.log(table_str);
    document.getElementById("xp_table").innerText = table_str;
    document.getElementById("xp_dif").innerText = numeric_to_string_(output);
}
