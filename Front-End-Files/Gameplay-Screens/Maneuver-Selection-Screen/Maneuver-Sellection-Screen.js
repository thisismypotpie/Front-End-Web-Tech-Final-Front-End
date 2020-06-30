//Get data needed for this page.
var all_teams = JSON.parse(sessionStorage.getItem("all_teams"));
var selected_ship_index = 0;
var maneuver_index = 0;
var team_index = 0;

//Grab element needed to manipulate.
var pilot_image = document.getElementById("pilot-image");
var roster_number_label = document.getElementById("roster-text");
var pilot_skill_label = document.getElementById("pilot-skill-text");
var attack_label = document.getElementById("attack-text");
var agility_label = document.getElementById("agility-text");
var hull_label = document.getElementById("hull-text");
var shield_label = document.getElementById("shield-text");
var energy_label = document.getElementById("energy-text");
var maneuver_range_label = document.getElementById("maneuver-range");
var maneuver_type_label = document.getElementById("maneuver-type");
var card_type_label = document.getElementById("card-type-label");
var card_list = document.getElementById("card-box");
var team_name_label = document.getElementById("team-name-label");

//Set the first pilot to select maneuver of  the first team.
pilot_image.style.backgroundImage = "url("+all_teams[0].ship_list[selected_ship_index].chosen_pilot.image_path+")";
roster_number_label.innerText = all_teams[team_index].ship_list[selected_ship_index].roster_number;
pilot_skill_label.innerText = all_teams[team_index].ship_list[selected_ship_index].current_pilot_skill;
attack_label.innerText = all_teams[team_index].ship_list[selected_ship_index].current_attack;
agility_label.innerText = all_teams[team_index].ship_list[selected_ship_index].current_agility;
hull_label.innerText = all_teams[team_index].ship_list[selected_ship_index].current_hull;
shield_label.innerText = all_teams[team_index].ship_list[selected_ship_index].current_sheilds;
energy_label.innerText = all_teams[team_index].ship_list[selected_ship_index].current_energy;
maneuver_range_label.style.backgroundImage = "url("+all_teams[0].ship_list[selected_ship_index].chosen_pilot.ship_name.maneuvers[maneuver_index].range_symbol_path+")";
maneuver_type_label.style.backgroundImage = "url("+all_teams[0].ship_list[selected_ship_index].chosen_pilot.ship_name.maneuvers[maneuver_index].maneuver_symbol_path+")";
card_type_label.textContent = "Conditions";
team_name_label.innerText = all_teams[team_index].team_name;
cycle_button_click();


//Thiis function will cycles through types of cards based on what is showing up currently.
function cycle_button_click()
{
    Array.from(document.getElementsByClassName("card-type-image")).forEach(card=>{
         card_list.removeChild(card);
    })
    
    if(card_type_label.innerText == "Upgrades")
    {
        card_type_label.textContent = "Critical Hit Cards";
        all_teams[team_index].ship_list[selected_ship_index].critical_hit_cards.forEach(crit_hit=>{
            var crit_hit_div = document.createElement("div");
            crit_hit_div.className = "card-type-image";
            crit_hit_div.style.backgroundImage = "url('"+ship_list[selected_ship_index].critical_hit_cards.image_path+"')";
            crit_hit_div.style.border = "1px solid white";
            crit_hit_div.style.backgroundRepeat = "no-repeat";
            crit_hit_div.style.backgroundSize = "100% 100%";
            crit_hit_div.style.margin = "3%";
            crit_hit_div.style.height = "75%";
            crit_hit_div.style.flex = "0 0 90%";//width is here.
            card_list.appendChild(crit_hit_div);
        })
    }
    else if(card_type_label.innerText == "Critical Hit Cards")
    {
        card_type_label.textContent = "Conditions";
        all_teams[team_index].ship_list[selected_ship_index].conditions.forEach(condition=>{
            var condition_div = document.createElement("div");
            condition_div.className = "card-type-image";
            condition_div.style.backgroundImage = "url('"+condition.image_path+"')";
            condition_div.style.border = "1px solid white";
            condition_div.style.backgroundRepeat = "no-repeat";
            condition_div.style.backgroundSize = "100% 100%";
            condition_div.style.margin = "3%";
            condition_div.style.height = "75%";
            condition_div.style.flex = "0 0 90%";//width is here.
            card_list.appendChild(condition_div);
        })
    }
    else if(card_type_label.innerText == "Conditions")
    {
        card_type_label.textContent = "Upgrades";
        all_teams[team_index].ship_list[selected_ship_index].upgrades.forEach(upgrade=>{
            var upgrade_div = document.createElement("div");
            upgrade_div.className = "card-type-image";
            upgrade_div.style.backgroundImage = "url('"+upgrade.image_path.split("\n")[0]+"')";
            if(upgrade.characteristics != null && upgrade.characteristics.split("*").includes("Dual"))
            {
                upgrade_div.style.border = "3px solid red";
            }
            else
            {
                upgrade_div.style.border = "1px solid white";
            }
            upgrade_div.style.backgroundRepeat = "no-repeat";
            upgrade_div.style.backgroundSize = "100% 100%";
            upgrade_div.style.margin = "3%";
            upgrade_div.style.height = "75%";
            upgrade_div.style.flex = "0 0 90%";//Width is here.
            card_list.appendChild(upgrade_div);
        })
    }
    else
    {
        alert("ERROR: No card type could be determined.");
    }
    
}


function critical_hit_token_click()
{
    
}