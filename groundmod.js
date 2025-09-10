// ==Sandboxels Mod==
// @name Ground Tool Online-Friendly
// @version 1.0
// @description Click foods to grind them into powders, pulps, or paste. Rehydration and visual effects included.
// ==/Sandboxels Mod==

// Helper for spawning small particles
function spawnParticles(x, y, color, count){
    for(let i=0;i<count;i++){
        let dx = x + Math.random()*3-1.5;
        let dy = y + Math.random()*3-1.5;
        createPixel({x:dx, y:dy, element:"particle", color:color});
    }
}

// Particle element
elements.particle = { color:"#ffffff", behavior:behaviors.WALL, category:"fx", state:"solid", density:0 };

// Ground (Powder) Foods
elements.ground_meat = { color:"#b34747", behavior:behaviors.POWDER, category:"food", state:"solid", density:1050 };
elements.ground_wheat = { color:"#e6d36f", behavior:behaviors.POWDER, category:"food", state:"solid", density:900 };
elements.ground_potato = { color:"#d9c27a", behavior:behaviors.POWDER, category:"food", state:"solid", density:980 };
elements.ground_carrot = { color:"#e68a2e", behavior:behaviors.POWDER, category:"food", state:"solid", density:970 };

// Pulp (Juicy) Foods
elements.apple_pulp = { color:"#cc5555", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1050 };
elements.berry_pulp = { color:"#aa3377", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1040 };
elements.tomato_pulp = { color:"#d03030", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1030 };
elements.grape_pulp = { color:"#663399", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1045 };
elements.orange_pulp = { color:"#ff9933", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1045 };

// Blended Paste
elements.blended_paste = { color:"#996633", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1060, tick:function(p){if(Math.random()<0.002)changePixel(p,"dried_paste");}};

// Dried Paste
elements.dried_paste = { color:"#80552b", behavior:behaviors.WALL, category:"food", state:"solid", density:1200 };

// Paste Powder
elements.paste_powder = { color:"#c2a57a", behavior:behaviors.POWDER, category:"food", state:"solid", density:950, reactions:{
    "water":{elem1:"blended_paste",elem2:null},
    "milk":{elem1:"milk_paste",elem2:null},
    "juice":{elem1:"juice_paste",elem2:null},
    "honey":{elem1:"paste_jelly",elem2:null},
    "syrup":{elem1:"paste_jelly",elem2:null}
}};

// Liquid Variants
elements.milk_paste = { color:"#f0e5c0", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1050 };
elements.juice_paste = { color:"#ffb347", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1040 };
elements.paste_jelly = { color:"#b47f4d", behavior:behaviors.WALL, category:"food", state:"solid", density:1100 };

// Food Mappings
let groundMap = { meat:"ground_meat", wheat:"ground_wheat", bread:"ground_wheat", potato:"ground_potato", carrot:"ground_carrot" };
let pulpMap = { apple:"apple_pulp", berry:"berry_pulp", tomato:"tomato_pulp", grape:"grape_pulp", orange:"orange_pulp" };
let blendFoods = ["soup","sandwich","pizza","stew","salad"];

// --- Click-to-grind functionality ---
onClickPixel = function(pixel){
    if(!pixel) return;
    let x=pixel.x, y=pixel.y;

    if(groundMap[pixel.element]){
        changePixel(pixel, groundMap[pixel.element]);
        spawnParticles(x, y, "#c2b280", 5);
    }
    else if(pulpMap[pixel.element]){
        changePixel(pixel, pulpMap[pixel.element]);
        spawnParticles(x, y, elements[pixel.element].color, 8);
    }
    else if(blendFoods.includes(pixel.element)){
        changePixel(pixel,"blended_paste");
        spawnParticles(x, y, "#996633", 10);
    }
    else if(pixel.element==="dried_paste"){
        changePixel(pixel,"paste_powder");
        spawnParticles(x, y, "#c2a57a", 6);
    }
};
