var flipped = false;//keeps track if front or back or large ship is showing.

//Set Galactic Conquest variables
let whos_turn = sessionStorage.getItem("gc_whos_turn");
var all_factions = JSON.parse(sessionStorage.getItem("gc_factions"));//[0] is rebels, [1] is empire..
var payment_method = undefined;//Set when the player chooses which type of payment they want to use.

  //Get data objects needed for this page.
  let ship_in_progress = JSON.parse(sessionStorage.getItem("ship_in_progress"));
  var game_data= JSON.parse(sessionStorage.getItem("game_data"));
  console.log(ship_in_progress);
//Set pilot image of chosen pilot.
document.getElementById("pilot-picture").style.backgroundImage = "url('"+ship_in_progress.chosen_pilot.image_path+"')";

//Set price variables and set them up in set_ship_prices.
var currency_cost = undefined;
var aleternate_currency_cost = undefined;
var durasteel_cost = undefined;
var parts_cost = undefined;
var electronics_cost = undefined;
var tibanna_cost = undefined;
var fuel_cost = undefined;
set_ship_prices();

//I will be making a loop that will paste all of the upgrades a ship into the next available picture and then set the next empty to next selection.
let grid_items = document.getElementsByClassName("grid-item");
document.getElementById("next-selection").id = "empty";
ship_in_progress.upgrades.forEach(upgrade =>{
   let element = document.getElementById("empty");
   if(upgrade.upgrade.is_dual_sided == true)//If it is a dual upgrade, show the first side of that upgrade.upgrade.
   {
    element.style.backgroundImage = "url('"+upgrade.upgrade.image_path.split("\n")[0]+"')";
    element.style.border = "3px solid red";
   }
   else
   {
    element.style.backgroundImage = "url('"+upgrade.upgrade.image_path+"')";
   }
   //Add orndance tokens if an upgrade has them.
   if(upgrade.ordnance_tokens > 0)
   {
     var ordnance_token_quantity = document.createElement("div");
     ordnance_token_quantity.id = "ordnance-token-quantity"
     ordnance_token_quantity.style.gridRow = "1";
     ordnance_token_quantity.style.gridColumn = "2";
     ordnance_token_quantity.style.backgroundImage = "url('https://i.imgur.com/DztMvcD.png')";
     ordnance_token_quantity.style.backgroundRepeat = "no-repeat";
     ordnance_token_quantity.style.backgroundSize = "100% 100%";
     ordnance_token_quantity.textContent = "X"+upgrade.ordnance_tokens;
     ordnance_token_quantity.style.fontSize = "xx-large";
     ordnance_token_quantity.style.fontFamily = "Impact, Charcoal, sans-serif";
     ordnance_token_quantity.style.textAlign = "right"
     ordnance_token_quantity.style.color = "white";
     element.appendChild(ordnance_token_quantity);
   }
   //Add energy tokens
   if(upgrade.energy_allocated > 0)
   {
    var energy_token_quantity = document.createElement("div");
    energy_token_quantity.style.gridRow = "1";
    energy_token_quantity.style.gridColumn = "2";
    energy_token_quantity.style.backgroundImage = "url('https://i.imgur.com/21ZF1eI.png')";
    energy_token_quantity.style.backgroundRepeat = "no-repeat";
    energy_token_quantity.style.backgroundSize = "100% 100%";
    energy_token_quantity.textContent = "X"+upgrade.energy_allocated;
    energy_token_quantity.style.fontSize = "xx-large";
    energy_token_quantity.style.fontFamily = "Impact, Charcoal, sans-serif";
    energy_token_quantity.style.textAlign = "right"
    energy_token_quantity.style.color = "white";
    element.appendChild(energy_token_quantity);
   }

   element.addEventListener("click",function(){ //When you click each taken upgrade, you will be asked if you want to delete the upgrade.upgrade.
      show_input_pop_up("upgrade-removal-box");
      if(upgrade.upgrade.is_dual_sided == true)//If a dual sided upgrade is being deleted, split path to get only first side of upgrade.upgrade.
      {
        document.getElementById("upgrade-photo").style.backgroundImage = "url('"+upgrade.upgrade.image_path.split("\n")[0]+"')";
        document.getElementById("upgrade-photo").style.border = "3px solid red";
        document.getElementById("flip-button").style.visibility = "visible";
      }
      else
      {
        document.getElementById("upgrade-photo").style.backgroundImage = "url('"+upgrade.upgrade.image_path+"')";
        document.getElementById("upgrade-photo").style.border = "1px solid white";
      }
      //Checks to see if the upgrade you are bringing up is in the right category to have ordnance tokens.
      if(upgrade.upgrade.type == "Bombs" || upgrade.upgrade.type == "Torpedoes" || upgrade.upgrade.type == "Missiles")
      {
         document.getElementById("ordnance-upgrade-container").style.visibility = "visible";

         //Set the buttons so the correct upgrade stats are displayed and can be altered.
         document.getElementById("token-quantity").textContent = "X"+upgrade.ordnance_tokens;
         document.getElementById("subtract-ordnance-token").onclick =function(){subract_ordnance_token(upgrade)};
         document.getElementById("add-ordnance-token").onclick =function(){add_ordnance_token(upgrade)};

         //Show number of ordnance tokens on each affected upgrades.
         if(upgrade.ordnance_tokens > 0)
         {
           var ordnance_token_quantity = document.createElement("div");
           ordnance_token_quantity.style.gridRow = "1";
           ordnance_token_quantity.style.gridColumn = "2";
           ordnance_token_quantity.style.backgroundImage = "url('https://i.imgur.com/DztMvcD.png')";
           ordnance_token_quantity.style.backgroundRepeat = "no-repeat";
           ordnance_token_quantity.style.backgroundSize = "100% 100%";
           ordnance_token_quantity.textContent = "X"+upgrade.ordnance_tokens;
           ordnance_token_quantity.style.fontSize = "xx-large";
           ordnance_token_quantity.style.fontFamily = "Impact, Charcoal, sans-serif";
           ordnance_token_quantity.style.textAlign = "right"
           ordnance_token_quantity.style.color = "white";
           element.appendChild(ordnance_token_quantity);
         }
      }
      else if(upgrade.upgrade.type == "Hardpoint" || upgrade.upgrade.id == 47)//Ionization reaction also can store energy.
      {
        document.getElementById("energy-allocation-container").style.visibility = "visible";

        //Set the buttons so the correct upgrade stats are displayed and can be altered.
        document.getElementById("energy-quantity").textContent = "X"+upgrade.energy_allocated;
        document.getElementById("subtract-energy-token").onclick =function(){subract_energy_token(upgrade)};
        document.getElementById("add-energy-token").onclick =function(){add_energy_token(upgrade)};

        //Show number of ordnance tokens on each affected upgrades.
        if(upgrade.energy_allocated > 0)
        {
          var energy_token_quantity = document.createElement("div");
          energy_token_quantity.style.gridRow = "1";
          energy_token_quantity.style.gridColumn = "2";
          energy_token_quantity.style.backgroundImage = "url('https://i.imgur.com/21ZF1eI.png')";
          energy_token_quantity.style.backgroundRepeat = "no-repeat";
          energy_token_quantity.style.backgroundSize = "100% 100%";
          energy_token_quantity.textContent = "X"+upgrade.energy_allocated;
          energy_token_quantity.style.fontSize = "xx-large";
          energy_token_quantity.style.fontFamily = "Impact, Charcoal, sans-serif";
          energy_token_quantity.style.textAlign = "right"
          energy_token_quantity.style.color = "white";
          element.appendChild(energy_token_quantity);
        }
      }
      else
      {
         document.getElementById("ordnance-upgrade-container").style.visibility = "hidden";
         document.getElementById("energy-allocation-container").style.visibility = "hidden";
      }
      document.getElementById("upgrade-photo").setAttribute('name', upgrade.upgrade.name);//This is so when a user presses yes to delete, we can get the name of the upgrade.upgrade.
   })
   element.id = "taken";
})
if(ship_in_progress.upgrades.length <=12)
{
  document.getElementById("empty").id = "next-selection";
}

let next_upgrade_slot = document.getElementById("next-selection");
//click event for the next selection for upgrade slot with plus button on it.

next_upgrade_slot.addEventListener("click",function(){
  window.location.href = "Upgrade-Type-Selection/upgrade-type.html";
})

function close_remove_upgrade_pop_up()
{
  hide_input_pop_up("upgrade-removal-box");
  document.getElementById("flip-button").style.visibility = "hidden";
  document.getElementById("ordnance-upgrade-container").style.visibility = "hidden";
  document.getElementById("energy-allocation-container").style.visibility = "hidden";
  sessionStorage.setItem("ship_in_progress",JSON.stringify(ship_in_progress));
  location.reload();
}


function remove_upgrade()
{
   hide_input_pop_up("upgrade-removal-box");
   document.getElementById("flip-button").style.visibility = "hidden";
   document.getElementById("ordnance-upgrade-container").style.visibility = "hidden";
   document.getElementById("energy-allocation-container").style.visibility = "hidden";
   //get the name of the upgrade, remove it from the ship's list of upgrades, then reload the page.
   let upgrade_name = document.getElementById("upgrade-photo").getAttribute("name");
   for(var i =0; i < ship_in_progress.upgrades.length;i++)
   {
     if(ship_in_progress.upgrades[i].upgrade.name == upgrade_name)
     {
      ship_in_progress.upgrades.splice(i,1);
      break;
     }
   }
    sessionStorage.setItem("ship_in_progress",JSON.stringify(ship_in_progress));
   window.location.reload();
}


//Check if flip button is visible or not.
if(ship_in_progress.chosen_pilot.ship_name.ship_type == "largeTwoCard")
{
  document.getElementById('main-flip-button').style.visibility = "visible";
}

function flip_button_click()
{
    let upgrade_name = document.getElementById("upgrade-photo").getAttribute("name");
    for(var i =0; i < ship_in_progress.upgrades.length;i++)
    {
      if(ship_in_progress.upgrades[i].upgrade.name == upgrade_name)
      {
        if(ship_in_progress.upgrades[i].orientation == "front")
        {
          ship_in_progress.upgrades[i].orientation = "back";
          document.getElementById("upgrade-photo").style.backgroundImage = "url('"+ship_in_progress.upgrades[i].upgrade.image_path.split("\n")[1]+"')";

        }
        else
        {
          ship_in_progress.upgrades[i].orientation = "front";
          document.getElementById("upgrade-photo").style.backgroundImage = "url('"+ship_in_progress.upgrades[i].upgrade.image_path.split("\n")[0]+"')";
        }
        break;
      }
    }
}

function flip_ship(){
  if(flipped == false)
  {
    document.getElementById('pilot-picture').style.backgroundImage = "url('"+ship_in_progress.chosen_pilot.aft_card_path+"')";
    flipped = true;
  }
  else
  {
    document.getElementById('pilot-picture').style.backgroundImage = "url('"+ship_in_progress.chosen_pilot.image_path+"')";
    flipped = false;
  }
}


function back_button_push()
{
  sessionStorage.removeItem("ship_in_progress");
  remove_newly_created_team_name(ship_in_progress.team_name,whos_turn=="Rebels"? 0:1);
  window.location.href = "../Pilot-Selection/pilot-selection.html";
}

function parts_only_button_click()
{
  var faction_index = undefined;
  if(whos_turn == "Rebels")
  {
    faction_index = 0;
  }
  else if(whos_turn == "Imperial")
  {
    faction_index = 1;
  }
  else
  {
    alert("ERROR: Could not determine who's turn it is.");
  }

  if(currency_cost > all_factions[faction_index].currency ||
     parts_cost > all_factions[faction_index].parts ||
     electronics_cost > all_factions[faction_index].electronics ||
     durasteel_cost > all_factions[faction_index].durasteel ||
     tibanna_cost > all_factions[faction_index].tibanna ||
     fuel_cost > all_factions[faction_index].fuel)
  {
    hide_input_pop_up("payment-type-pop-up");
    document.getElementById("notification-pop-up-title").textContent = "You do not have the resources to pay this way.";
    show_input_pop_up("notification-pop-up");
  }
  else
  {
    payment_method = "Parts";
    hide_input_pop_up("payment-type-pop-up");
    show_input_pop_up("roster-number-box");
    document.getElementById("roster-number-input").focus();
  }
}

function currency_only_button_click()
{
  var faction_index = undefined;
  if(whos_turn == "Rebels")
  {
    faction_index = 0;
  }
  else if(whos_turn == "Imperial")
  {
    faction_index = 1;
  }
  else
  {
    alert("ERROR: Could not determine who's turn it is.");
  }
  if(aleternate_currency_cost > all_factions[faction_index].currency)
  {
    hide_input_pop_up("payment-type-pop-up");
    document.getElementById("notification-pop-up-title").textContent = "You do not have the resources to pay this way.";
    show_input_pop_up("notification-pop-up");
  }
  else
  {
    payment_method = "Currency";
    hide_input_pop_up("payment-type-pop-up");
    show_input_pop_up("roster-number-box");
    document.getElementById("roster-number-input").focus();
  }
}

function hide_input_pop_up(name)
{
  var overlay = undefined;
  if(name == "notification-pop-up")
  {
    overlay = document.getElementById("notification-overlay");
  }
  else
  {
    overlay = document.getElementById("overlay");
  }
  let screen = document.getElementById(name);
  overlay.style.opacity = 0;
  screen.style.visibility = "hidden";
  overlay.style.pointerEvents = "none";
}

function show_input_pop_up(name)
{
  var overlay = undefined;
  if(name == "notification-pop-up")
  {
    overlay = document.getElementById("notification-overlay");
  }
  else
  {
    overlay = document.getElementById("overlay");
  }
  let screen = document.getElementById(name);
  overlay.style.opacity = 1;
  screen.style.visibility = "visible";
  overlay.style.pointerEvents = "all";
}


function ok_button_push()
{
    var faction_index = undefined;
    if(whos_turn == "Rebels")
    {
       faction_index = 0;
    }
    else if(whos_turn == "Imperial")
    {
      faction_index = 1;
    }
    else
    {
      alert("ERROR: Unable to find who's turn it is.");
    }

      //Add roster number to ship and add new team to all teams.
      //Validate input and then add roster number to ship in progress.
      if(!/^[0-9]+$/.test(document.getElementById("roster-number-input").value))
      {
         alert("Please only input positive numbers. No other input will be accepted.");
         document.getElementById("roster-number-input").value = "";
         document.getElementById("roster-number-input").focus();
         return;
      }
      else if(is_roster_number_taken(parseInt(document.getElementById("roster-number-input").value,10)) == true)
      {
         
        //hide_input_pop_up("payment-type-pop-up");
        //document.getElementById("notification-pop-up-title").textContent = "That roster number is taken, please enter a new one..";
        //show_input_pop_up("notification-pop-up");
        alert("That roster number is taken, please enter a new one.");
        document.getElementById("roster-number-input").value = "";
        document.getElementById("roster-number-input").focus();
        return;
      }
      else
      {
         ship_in_progress.roster_number = parseInt(document.getElementById("roster-number-input").value,10);
      }
       
      //Add ship to team.
      let selected_team_indices = JSON.parse(sessionStorage.getItem("team_indecies"));
      all_factions[selected_team_indices[0]].navy[selected_team_indices[1]].team.ship_list.push(ship_in_progress);
      //new_team.team.ship_list.push(ship_in_progress);
      //all_factions[faction_index].navy.push(new_team);


      //pay for the new ship.
      if(payment_method =="Currency")
      {
        all_factions[faction_index].currency -= aleternate_currency_cost;
      }
      else if(payment_method =="Parts")
      {
        all_factions[faction_index].currency -= currency_cost;
        all_factions[faction_index].parts -= parts_cost;
        all_factions[faction_index].electronics -= electronics_cost;
        all_factions[faction_index].durasteel -= durasteel_cost;
        all_factions[faction_index].fuel -= fuel_cost;
        all_factions[faction_index].tibanna -= tibanna_cost;
      }
      else
      {
        alert("ERROR: Could not determine payment methos.");
        return;
      }
      sessionStorage.setItem("gc_factions",JSON.stringify(all_factions));

   
      //remove all items that are no longer being used.
      check_if_name_needs_to_be_upgraded(ship_in_progress,sessionStorage.getItem("team_name"));
      sessionStorage.removeItem("chosenShip");
      sessionStorage.removeItem("ship_in_progress");
      sessionStorage.removeItem("team_indecies");
      window.location.href = "../../team-view.html";

      var dual_card_back_showing = false; //This is used for if the flip button shows up, if false showing front, if true, showing back
}

function close_button_push()//close the roster number pop-up.
{
  hide_input_pop_up("roster-number-box");
  document.getElementById("roster-number-input").value = "";
}

function subract_ordnance_token(upgrade)
{
  if(upgrade.ordnance_tokens > 0)
  {
    upgrade.ordnance_tokens--;

  }
  else
  {
    upgrade.ordnance_tokens = 0;
  }
  document.getElementById("token-quantity").textContent = "X"+upgrade.ordnance_tokens;
}

function add_ordnance_token(upgrade)
{
    upgrade.ordnance_tokens++;
    document.getElementById("token-quantity").textContent = "X"+upgrade.ordnance_tokens;
}

function add_energy_token(upgrade)
{
  upgrade.energy_allocated++;
  document.getElementById("energy-quantity").textContent = "X"+upgrade.energy_allocated;

}

function subract_energy_token(upgrade)
{
  if(upgrade.energy_allocated > 0)
  {
    upgrade.energy_allocated--;

  }
  else
  {
    upgrade.energy_allocated = 0;
  }
  document.getElementById("energy-quantity").textContent = "X"+upgrade.energy_allocated;
}

function set_ship_prices()
{
  var faction_turn = undefined
  var current_ship = ship_in_progress.chosen_pilot;
  var upgrade_cost = 0;
  var upgrade_minus =0;//for upgrades that cost less than 0.
  ship_in_progress.upgrades.forEach(upgrade=>{
    if(upgrade.upgrade.cost > 0)
    {
      upgrade_cost += upgrade.upgrade.cost;
    }
    else
    {
      upgrade_minus+=upgrade.upgrade.cost;
    }
  })
  if(whos_turn == "Rebels")
  {
    faction_turn = all_factions[0];
  }
  else if(whos_turn == "Imperial")
  {
    faction_turn = all_factions[1];
  }
  else
  {
    alert("ERROR: Cannot determine who's turn it is.")
  }
  //Set cost of ship.
  if(current_ship.ship_name.ship_type == "largeTwoCard")
  {
      fuel_cost = "4";
      currency_cost = Math.ceil((current_ship.cost+upgrade_minus)/5)+upgrade_cost;
      parts_cost = current_ship.ship_name.agility + current_ship.ship_name.aft_agility + current_ship.ship_name.energy;
      electronics_cost = current_ship.ship_name.shields + current_ship.ship_name.aft_shields;
      tibanna_cost = current_ship.ship_name.attack;
      durasteel_cost = current_ship.ship_name.hull + current_ship.ship_name.aft_hull;
      aleternate_currency_cost = current_ship.cost+upgrade_cost+upgrade_minus;
  }
  else
  {
       currency_cost = Math.ceil((current_ship.cost+upgrade_minus)/5)+upgrade_cost;
       parts_cost =  current_ship.ship_name.agility;
       electronics_cost = current_ship.ship_name.shields;
       tibanna_cost = current_ship.ship_name.attack;
       durasteel_cost =  current_ship.ship_name.hull;
       aleternate_currency_cost = current_ship.cost+upgrade_cost+upgrade_minus;

    if(current_ship.ship_name.ship_type == "small")
    {
      fuel_cost = "1";
    }
    else if(current_ship.ship_name.ship_type == "medium")
    {
      fuel_cost = "2";
    }
    else if(current_ship.ship_name.ship_type == "largeOneCard")
    {
      fuel_cost = "3";
      parts_cost= current_ship.ship_name.agility+current_ship.ship_name.energy;
    }
    else
    {
      alert("Unknown Ship Size!");
    }
  }

      document.getElementById("cost-fuel-quantity").textContent = fuel_cost+" / "+faction_turn.fuel;
      document.getElementById("cost-curreny-quantity").textContent = currency_cost+" / "+faction_turn.currency;
      document.getElementById("cost-parts-quantity").textContent = parts_cost+" / "+faction_turn.parts;
      document.getElementById("cost-electronics-quantity").textContent = electronics_cost+" / "+faction_turn.electronics;
      document.getElementById("cost-tibanna-quantity").textContent = tibanna_cost+" / "+faction_turn.tibanna;
      document.getElementById("cost-durasteel-quantity").textContent = durasteel_cost+" / "+faction_turn.durasteel;
      document.getElementById("alternate-cost-curreny-quantity").textContent = aleternate_currency_cost+" / "+faction_turn.currency;

}

//Check validation of current team to see if a roster number is already taken
function is_roster_number_taken(input_number)
{
      var found_roster = false;
      //All teams and chosen team name were undefined within this function so I am grabbing it again.
      let selected_team_indices = JSON.parse(sessionStorage.getItem("team_indecies"));
      var team = all_factions[selected_team_indices[0]].navy[selected_team_indices[1]].team;

  team.ship_list.forEach(ship =>{
        if(ship.roster_number == input_number)
        {
          found_roster = true;
        }
  })
  return found_roster;
}

//Key bindings
document.onkeyup = function(e) {
if(document.getElementById("roster-number-box").style.visibility == "visible")
{ 
  if(e.keyCode == 13)//enter
  {
    ok_button_push();
  }
  else if(e.keyCode == 27)//escape key
  {
    close_button_push();
  } 
}
else
{
  if(e.keyCode == 13)//enter
  {
    done_button_push();
  }
  else if(e.keyCode == 27)//escape key
  {
    back_button_push();
  }
}
}

