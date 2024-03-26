const NUMERIC_SUFFIX = [  "",   "k",   "m",   "b",    "t",   "qd",   "qn",   "sx",   "sp",   "oc",   "no",
                                "de", "ude", "dde", "tde", "qdde", "qnde", "sxde", "spde", "ocde", "node",
                                "vt", "uvt", "dvt", "tvt", "qdvt", "qnvt", "sxvt", "spvt", "ocvt", "novt"];


function round(x, a) {
    return 10**a*Math.round(x/10**a)
}

function EXP_calculate(level) {
    if (level == 1) {
        return 5;
    } else {
        XP = 20*Math.floor(1.05**(level-1)*level)
        return round(XP, Math.floor(Math.log10(XP))-1);
    }
}

function numeric_to_string(number) {
    // get digits
    if (number <= 0) return 0;
    len = Math.floor(Math.log10(number)) + 1;
    suffix = Math.floor((len-1)/3);
    modified = round(number, len-2);
    string = modified/10**(3*suffix) + NUMERIC_SUFFIX[suffix];
    return string;
}

// MAIN CODE

function on_calculate_EXP() {
    if (EXP_calculate(Number(document.getElementById("level_input").value)) <= Number(document.getElementById("exp_input").value)) {
        alert("The EXP of this level is " + numeric_to_string(Number(document.getElementById("level_input").value)) + " but the EXP is larger than this.");
        return;
    };
    let XP =Number(document.getElementById("petal_common_input").value) * 1 + 
            Number(document.getElementById("petal_unusual_input").value) * 5 + 
            Number(document.getElementById("petal_rare_input").value) * 50 + 
            Number(document.getElementById("petal_epic_input").value) * 500 + 
            Number(document.getElementById("petal_legendary_input").value) * 10_000 + 
            Number(document.getElementById("petal_mythic_input").value) * 500_000 + 
            Number(document.getElementById("petal_ultra_input").value) * 50_000_000 + 
            Number(document.getElementById("petal_super_input").value) * 5_000_000_000,
        level = Number(document.getElementById("level_input").value),
        rXP =  Number(document.getElementById("exp_input").value);
    if (document.getElementById("exp_calculate_type").value == "after") {
        XP+=rXP;
        while (XP-EXP_calculate(level) >= 0) {
            XP-=EXP_calculate(level);
            level++;
        }
    } else {
        while (rXP - XP < 0) {
            XP -= rXP;
            level--;
            rXP = EXP_calculate(level);
            if (level == 0) {
                alert("ERROR: Level gone below 1, stopped.");
                return;
            }
        };
        XP = Number(EXP_calculate(level)) - XP;
    };
    document.getElementById("EXP_result").innerText = "Level: " + level + "; XP: " + XP + " (" + numeric_to_string(XP) + ")";
    return;
}