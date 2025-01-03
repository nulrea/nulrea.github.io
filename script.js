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

function round(x, a) {
    return 10**a*Math.round(x/10**a)
}

function f(x) {
    return Number((20*(Math.floor((2*x)*1.05**(2*x-1))+Math.floor((2*x+1)*1.05**(2*x)))).toPrecision(2))
}

function XP_calculate(level) {
    if (level == 1) {
        return 15
    } else if (level > 7137) {
        return Infinity
    } else {
        return f(level)
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

function on_calculate_XP() {
    if (XP_calculate(Number(document.getElementById("level_input").value)) <= Number(document.getElementById("XP_input").value)) {
        alert("The XP of this level is " + numeric_to_string(XP_calculate(Number(document.getElementById("level_input").value)), 2) + " but the XP is larger than this.")
        return
    }
    let XP = Number(document.getElementById("petal_input").value),
        level = Number(document.getElementById("level_input").value),
        rXP =  Number(document.getElementById("XP_input").value)
    if (rXP < 0) {
        alert("Your current XP must be nonnegative, right?")
        return
    }
    if (document.getElementById("XP_calculate_type").value == "after") {
        XP+=rXP
        while (XP-XP_calculate(level) >= 0) {
            XP-=XP_calculate(level)
            level++
        }
    } else {
        rXP -= XP
        while (rXP < 0) {
            level--
            XP=XP_calculate(level)
            if (level <= 0) {
                alert("Error: Level gone below 1 when still have " + -rXP + " XP remain.")
                return
            }
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
    if (Number(document.getElementById("b_level_input").value) > Number(document.getElementById("a_level_input").value)) {  
        alert("Level before is greater than level after.")
        return
    } else if ((Number(document.getElementById("b_level_input").value) === Number(document.getElementById("a_level_input").value)) && (Number(document.getElementById("b_XP_input")) > Number(document.getElementById("a_XP_input")))) {
        alert("XP before is greater than XP after.")
    }
    let XP = Number(document.getElementById("a_XP_input").value) - Number(document.getElementById("b_XP_input").value)
    for (let i = Number(document.getElementById("b_level_input").value); i < Number(document.getElementById("a_level_input").value); i++) {
        XP += XP_calculate(i)
    }
    document.getElementById("xp_dif").innerText = numeric_to_string_(XP)
}
