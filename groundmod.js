// ==Sandboxels Mod==
// @name Ground Tool Full Cycle + Visuals
// @version 1.9
// @description Ground Tool with full cycle, liquid variants, and visual effects
// ==/Sandboxels Mod==

// Helper for spawning small particles
function spawnParticles(x, y, color, count){
    for(let i=0; i<count; i++){
        let dx = x + Math.random()*3-1.5;
        let dy = y + Math.random()*3-1.5;
        createPixel({x:dx, y:dy, element: "particle", color: color});
    }
}

// --- Particle element for visuals ---
elements.particle = { color:"#ffffff", behavior:behaviors.WALL, category:"fx", state:"solid", density:0 };

// --- Ground (Powder) Foods ---
elements.ground_meat = { color:"#b34747", behavior:behaviors.POWDER, category:"food", state:"solid", density:1050 };
elements.ground_wheat = { color:"#e6d36f", behavior:behaviors.POWDER, category:"food", state:"solid", density:900 };
elements.ground_potato = { color:"#d9c27a", behavior:behaviors.POWDER, category:"food", state:"solid", density:980 };
elements.ground_carrot = { color:"#e68a2e", behavior:behaviors.POWDER, category:"food", state:"solid", density:970 };

// --- Pulp (Juicy) Foods ---
elements.apple_pulp = { color:"#cc5555", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1050 };
elements.berry_pulp = { color:"#aa3377", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1040 };
elements.tomato_pulp = { color:"#d03030", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1030 };
elements.grape_pulp = { color:"#663399", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1045 };
elements.orange_pulp = { color:"#ff9933", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1045 };

// --- Blended Paste ---
elements.blended_paste = {
    color:"#996633",
    behavior:behaviors.LIQUID,
    category:"food",
    state:"liquid",
    density:1060,
    tick: function(pixel){ if(Math.random()<0.002) changePixel(pixel,"dried_paste"); }
};

// --- Dried Paste ---
elements.dried_paste = { color:"#80552b", behavior:behaviors.WALL, category:"food", state:"solid", density:1200 };

// --- Paste Powder ---
elements.paste_powder = {
    color:"#c2a57a",
    behavior:behaviors.POWDER,
    category:"food",
    state:"solid",
    density:950,
    reactions: {
        "water": { elem1:"blended_paste", elem2:null },
        "milk": { elem1:"milk_paste", elem2:null },
        "juice": { elem1:"juice_paste", elem2:null },
        "honey": { elem1:"paste_jelly", elem2:null },
        "syrup": { elem1:"paste_jelly", elem2:null }
    }
};

// --- Liquid variants ---
elements.milk_paste = { color:"#f0e5c0", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1050 };
elements.juice_paste = { color:"#ffb347", behavior:behaviors.LIQUID, category:"food", state:"liquid", density:1040 };
elements.paste_jelly = { color:"#b47f4d", behavior:behaviors.WALL, category:"food", state:"solid", density:1100 };

// --- Mapping foods ---
let groundMap = { meat:"ground_meat", wheat:"ground_wheat", bread:"ground_wheat", potato:"ground_potato", carrot:"ground_carrot" };
let pulpMap = { apple:"apple_pulp", berry:"berry_pulp", tomato:"tomato_pulp", grape:"grape_pulp", orange:"orange_pulp" };
let blendFoods = ["soup","sandwich","pizza","stew","salad"];

// --- Ground Tool with visuals ---
tools.ground = {
    name:"Ground Tool",
    description:"Grinds food into powder, pulp, or paste with visual effects.",
    color:"#a0522d",
    tool:function(pixel){
        if(elements[pixel.element].category==="food"){
            let x=pixel.x, y=pixel.y;
            if(groundMap[pixel.element]){
                changePixel(pixel, groundMap[pixel.element]);
                spawnParticles(x, y, "#c2b280", 5); // dust particles
            }
            else if(pulpMap[pixel.element]){
                changePixel(pixel, pulpMap[pixel.element]);
                spawnParticles(x, y, elements[pixel.element].color, 8); // splash
            }
            else if(blendFoods.includes(pixel.element)){
                changePixel(pixel,"blended_paste");
                spawnParticles(x, y, "#996633", 10); // swirls
            }
            else if(pixel.element==="dried_paste"){
                changePixel(pixel,"paste_powder");
                spawnParticles(x, y, "#c2a57a", 6); // powder burst
            }
            else{
                changePixel(pixel,"dust");
                spawnParticles(x, y, "#aaaaaa", 4); // fallback dust
            }
        }
    }
};