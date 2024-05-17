const NUMERIC_SUFFIX = [  "",   "k",   "m",   "b",    "t",   "qd",   "qn",   "sx",   "sp",   "oc",   "no",
                                "de", "ude", "dde", "tde", "qdde", "qnde", "sxde", "spde", "ocde", "node",
                                "vt", "uvt", "dvt", "tvt", "qdvt", "qnvt", "sxvt", "spvt", "ocvt", "novt",
                                "tg", "utg", "dtg", "ttg", "qdtg", "qntg", "sxtg", "sptg", "octg", "notg",
                                "qd", "uqd", "dqd", "tqd", "qdqd", "qnqd", "sxqd", "spqd", "ocqd", "noqd",
                                "qg", "uqg", "dqg", "tqg", "qdqg", "qnqg", "sxqg", "spqg", "ocqg", "noqg",
                                "sg", "usg", "dsg", "tsg", "qdsg", "qnsg", "sxsg", "spsg", "ocsg", "nosg",
                                "st", "ust", "dst", "tst", "qdst", "qnst", "sxst", "spst", "ocst", "nost",
                                "og", "uog", "dog", "tog", "qdog", "qnog", "sxog", "spog", "ocog", "noog",
                                "ng", "ung", "dng", "tng", "qdng", "qnng", "sxng", "spng", "ocng", "nong",
                                "ce", "uce",
],
      RARITY_INDEX = ["common", "unusual", "rare", "epic", "legendary", "mythic",  "ultra",    "super",   "celestial",         "chaos",         "effulgent"],
      CORRES_VALUE = [       1,         5,     50,     500,      10000,   500000, 50000000, 5000000000, 1000000000000, 500000000000000, 1000000000000000000]

let is_visible = false

function round(x, a) {
    return 10**a*Math.round(x/10**a)
}

function f(x) {
    return 10*Math.round(4*x*1.05**(2*x+1)+(4*x+2)*1.05**(2*x))
}

function EXP_calculate(level) {
    if (level == 1) {
        return 15
    } else if (level > 7137) {
        return Infinity
    } else {
        XP = 10*Math  // inaccurate
        return Number(f(level).toPrecision(2))
    }
}

function numeric_to_string(number, digit) {
    // get digits
    if (number <= 0) return 0
    if (number === Infinity) return undefined
    len = Math.floor(Math.log10(number)) + 1
    suffix = Math.floor((len-1)/3)
    modified = number.toPrecision(digit)  // ???
    string = modified/10**(3*suffix) + NUMERIC_SUFFIX[suffix]
    return string
}

function on_calculate_EXP() {
    if (EXP_calculate(Number(document.getElementById("level_input").value)) <= Number(document.getElementById("exp_input").value)) {
        alert("The EXP of this level is " + numeric_to_string(EXP_calculate(Number(document.getElementById("level_input").value)), 2) + " but the EXP is larger than this.")
        return
    }
    let XP = Number(document.getElementById("petal_input").value),
        level = Number(document.getElementById("level_input").value),
        rXP =  Number(document.getElementById("exp_input").value)
    if (document.getElementById("exp_calculate_type").value == "after") {
        XP+=rXP
        while (XP-EXP_calculate(level) >= 0) {
            XP-=EXP_calculate(level)
            level++
        }
    } else {
        rXP -= XP
        while (rXP < 0) {
            level--
            XP=EXP_calculate(level)
            if (level <= 0) {
                alert("Error: Level gone below 1 when still have " + -rXP + " XP remain.")
                return
            }
            rXP += XP
        }
        XP = rXP
    }
    document.getElementById("EXP_result").innerText = "Level " + level + ": " + XP + "/" + numeric_to_string(EXP_calculate(level), 2) + " (" + numeric_to_string(XP, 3) + ", " + (XP/EXP_calculate(level)*100).toPrecision(4) + "%)"
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
    return number + " (" + numeric_to_string(number, 3) + ")"
}

function level_difference() {
    if (Number(document.getElementById("b_level_input").value) > Number(document.getElementById("a_level_input").value)) {  
        alert("Level before is greater than level after.")
        return
    } else if ((Number(document.getElementById("b_level_input").value) === Number(document.getElementById("a_level_input").value)) && (Number(document.getElementById("b_exp_input")) > Number(document.getElementById("a_exp_input")))) {
        alert("XP before is greater than XP after.")
    }
    let XP = Number(document.getElementById("a_exp_input").value) - Number(document.getElementById("b_exp_input").value)
    for (let i = Number(document.getElementById("b_level_input").value); i < Number(document.getElementById("a_level_input").value); i++) {
        XP += EXP_calculate(i)
    }
    document.getElementById("xp_dif").innerText = numeric_to_string_(XP)
}
