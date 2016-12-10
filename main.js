global.err = global.err || function(num) {
switch(num) {
        case 0: return "OK";
        case -1: return "ERR_NOT_OWNER";
        case -2: return "ERR_NO_PATH";
        case -3: return "ERR_NAME_EXISTS";
        case -4: return "ERR_BUSY";
        case -5: return "ERR_NOT_FOUND";
        case -6: return "ERR_NOT_ENOUGH_RESOURCES";
        case -7: return "ERR_INVALID_TARGET";
        case -8: return "ERR_FULL";
        case -9: return "ERR_NOT_IN_RANGE";
        case -10: return "ERR_INVALID_ARGS";
        case -11: return "ERR_TIRED";
        case -14: return "ERR_RCL_NOT_ENOUGH";
        case -15: return "ERR_GCL_NOT_ENOUGH";
    }
}
global.roomlink = global.roomlink || function(room) {
    return "<a onclick='var scope = angular.element(document.querySelector(\".console-input .ace_scroller .ace_content\")).scope();scope.$apply(function() { scope.Console.command = \"aboutroom(\\\"" + room + "\\\")\" });scope.Console.sendCommand();'>" + room + "</a>";
}

global.aboutcreep = global.aboutcreep || function(id, opts) {
    var creep = Game.creeps[id];
    if(!creep) return "Creep " + id + " does not exist";

    var output = "<table>";
        output += "<tr><th style='padding-right: 5em'>Creep " + id + "</th></tr>";

        if(opts && opts.spawntime) {
            output += "<tr><td>Ticks to spawn:</td><td>" + opts.spawntime + "</td></tr>";
        } else {
            output += "<tr><td>Ticks to live:</td><td>" + creep.ticksToLive + " <progress value='" + creep.ticksToLive + "' max='1500'></td></tr>";
        }
        output += "<tr><td>Location:</td><td>" + roomlink(creep.pos.roomName) + " (" + creep.pos.x + ", " + creep.pos.y + ")</td></tr>";
        output += "<tr><td style='vertical-align:text-top'>Active Parts:</td><td>";
            var work = creep.getActiveBodyparts(WORK); if(work) { output += "<code>WORK</code> x" + work + "<br/>"; }
            var claim = creep.getActiveBodyparts(CLAIM); if(claim) { output += "<code>CLAIM</code> x" + claim + "<br/>"; } 
            var move = creep.getActiveBodyparts(MOVE); if(move) { output += "<code>MOVE</code> x" + move + "<br/>"; }
            var attack = creep.getActiveBodyparts(ATTACK); if(attack) { output += "<code>ATTACK</code> x" + attack + "<br/>"; }
            var ranged = creep.getActiveBodyparts(RANGED_ATTACK); if(ranged) { output += "<code>RANGED_ATTACK</code> x" + ranged + "<br/>"; }
            var heal = creep.getActiveBodyparts(HEAL); if(heal) { output += "<code>HEAL</code> x" + heal + "<br/>"; }
            var carry = creep.getActiveBodyparts(CARRY); if(carry) { output += "<code>CARRY</code> x" + carry + "<br/>"; }
        output += "</td></tr>";
    output += "</table>";

    output = new String(output);

    output.name = creep.name;
    output.ticksToLive = creep.ticksToLive;
    output.pos = creep.pos;

    return output;
}
    
global.upgrade = global.upgrade || function() {
    var output = "<table>";
    output += "<tr><th>Upgrade Progress</th></tr>";
    for(let i in Game.rooms) {
        var room = Game.rooms[i];
        if(room.controller && room.controller.my) {
            var p = room.controller.progress;
            var t = room.controller.progressTotal;
            output += "<tr><td>" + room.name + "</td><td>" + room.controller.level + ' <progress value="' + p + '" max="' + t + '"></progress> (' + (Math.floor((p / t) * 100000) / 1000) + "%)</td></tr>"
        }
    }
    output += "</table>";

    output = new String(output);
    return output;
}
    
global.aboutroom = global.aboutroom || function(id) {
    var room = Game.rooms[id];
    if(!room) return "Room " + id + " does not exist or is not available";

    var output = "<table>";
        output += "<tr><th style='padding-right: 5em'>Room " + id + "</th></tr>";

        if(room.controller.reservation) {
            output += "<tr><td>Reservation:</td><td>" + room.controller.reservation.username + " (" + room.controller.reservation.ticksToEnd + " ticks left)</td></tr>";
        } else if(room.controller.owner) {
            output += "<tr><td>Owner:</td><td>" + room.controller.owner.username + "</td></tr>";
            var p = room.controller.progress;
            var t = room.controller.progressTotal;
            output += '<tr><td>Level:</td><td>' + room.controller.level + ' <progress value="' + p + '" max="' + t + '"></progress> (' + (Math.floor((p / t) * 100000) / 1000) + '%)</td></tr>';
        } else {
            output += "<tr><td>Owner:</td><td>unowned</td></tr>";
        }

        output += "<tr><td>Available Energy:</td><td>" + room.energyAvailable + "/" + room.energyCapacityAvailable + "</td></tr>";

        output += "<tr><td>Storage:</td><td>" + (room.storage ? "yes" : "no") + "</td></tr>";
        output += "<tr><td>Terminal:</td><td>" + (room.terminal ? "yes" : "no") + "</td></tr>";
        
    output += "</table>";

    output = new String(output);
    return output;
}

global.aboutspawn = global.aboutspawn || function(id) {
    var spawn = Game.spawns[id];
    if(!spawn) return "Spawn " + id + " does not exist";
    
    var output = "<table>";
        output += "<tr><th>Spawn " + id + "</th></tr>";
        
        output += "<tr><td>Location:</td><td>" + roomlink(spawn.pos.roomName) + " (" + spawn.pos.x + ", " + spawn.pos.y + ")</td></tr>";
        if(spawn.spawning) {
            output += "<tr><td style='vertical-align:text-top'>Spawning:</td><td>"
                output += aboutcreep(spawn.spawning.name, { spawntime: spawn.spawning.remainingTime });
            output += "</td></tr>"
        }
    output += "</table>";

    output = new String(output);
    return output;
}

global.about = global.about || function(id) {
    if(Game.creeps[id]) {
        return aboutcreep(id);
    } else if(Game.rooms[id]) {
        return aboutroom(id);
    } else if(Game.spawns[id]) {
        return aboutspawn(id);
    } else if(Game.flags[id]) {
    } else {
        var obj = Game.getObjectById(id);
    }
}
    
global.boost = global.boost || function(mineral) {
    switch(mineral) {
        case "UH": return "<code>ATTACK</code> +100% attack effectiveness";
        case "UO": return "<code>WORK</code> +200% harvest effectiveness";
        case "KH": return "<code>CARRY</code> +50% capacity";
        case "KO": return "<code>RANGED_ATTACK</code> +100% rangedAttack and rangedMassAttack effectiveness";
        case "LH": return "<code>WORK</code> +50% repair and build effectiveness (does not increase energy cost)";
        case "LO": return "<code>HEAL</code> +100% heal and rangedHeal effectiveness";
        case "ZH": return "<code>WORK</code> +100% dismantle effectiveness";
        case "ZO": return "<code>MOVE</code> +100% fatigue decrease speed";
        case "GH": return "<code>WORK</code> +50% upgradeController effectiveness (does not increase energy cost)";
        case "GO": return "<code>TOUGH</code> -30% damage taken";
        
        case "UH2O": return "<code>ATTACK</code> +200% attack effectiveness";
        case "UHO2": return "<code>WORK</code> +400% harvest effectiveness";
        case "KH2O": return "<code>CARRY</code> +100% capacity";
        case "KHO2": return "<code>RANGED_ATTACK</code> +200% rangedAttack and rangedMassAttack effectiveness";
        case "LH2O": return "<code>WORK</code> +80% repair and build effectiveness (does not increase energy cost)";
        case "LHO2": return "<code>HEAL</code> +200% heal and rangedHeal effectiveness";
        case "ZH2O": return "<code>WORK</code> +200% dismantle effectiveness";
        case "ZHO2": return "<code>MOVE</code> +200% fatigue decrease speed";
        case "GH2O": return "<code>WORK</code> +80% upgradeController effectiveness (does not increase energy cost)";
        case "GHO2": return "<code>TOUGH</code> -50% damage taken";
        
        case "XUH2O": return "<code>ATTACK</code> +300% attack effectiveness";
        case "XUHO2": return "<code>WORK</code> +600% harvest effectiveness";
        case "XKH2O": return "<code>CARRY</code> +150% capacity";
        case "XKHO2": return "<code>RANGED_ATTACK</code> +300% rangedAttack and rangedMassAttack effectiveness";
        case "XLH2O": return "<code>WORK</code> +100% repair and build effectiveness (does not increase energy cost)";
        case "XLHO2": return "<code>HEAL</code> +300% heal and rangedHeal effectiveness";
        case "XZH2O": return "<code>WORK</code> +300% dismantle effectiveness";
        case "XZHO2": return "<code>MOVE</code> +300% fatigue decrease speed";
        case "XGH2O": return "<code>WORK</code> +100% upgradeController effectiveness (does not increase energy cost)";
        case "XGHO2": return "<code>TOUGH</code> -70% damage taken";
        
        default: return "";
    }
}

global.reaction = global.reaction || function(arg1, arg2) {
    if(arg1 && arg2) {
        return REACTIONS[arg1][arg2];
    } else if(arg1) {
        for(var i in REACTIONS) {
            for(var j in REACTIONS[i]) {
                if(REACTIONS[i][j] == arg1) {
                    return i + " + " + j;
                }
            }
        }
    }
}

global.docs = global.docs || "<a href='http://support.screeps.com/hc/en-us' target='_blank'>Screeps Documentation</a>";
global.slack = global.slack || "<a href='http://screeps.slack.com/' target='_blank'>Screeps Slack Channel</a>";
global.wiki = global.wiki || "<a href='http://wiki.screepspl.us/' target='_blank'>Screeps Unofficial Wiki</a>";
