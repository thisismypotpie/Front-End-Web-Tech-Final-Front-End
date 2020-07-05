  //Get data objects needed for this page.
  var selected_ship_index = sessionStorage.getItem("selected_ship_index");
  var team_index = sessionStorage.getItem("team_index");
  var game_data= JSON.parse(sessionStorage.getItem("game_data"));
  var all_teams = JSON.parse(sessionStorage.getItem("all_teams"));
  var ship_in_progress = all_teams[team_index].ship_list[selected_ship_index];
  var dual_card_back_showing = false; //This is used for if the flip button shows up, if false showing front, if true, showing back
//Set pilot image of chosen pilot.
document.getElementById("pilot-picture").style.backgroundImage = "url('"+ship_in_progress.chosen_pilot.image_path+"')";


//I will be making a loop that will paste all of the upgrades a ship into the next available picture and then set the next empty to next selection.
let grid_items = document.getElementsByClassName("grid-item");
document.getElementById("next-selection").id = "empty";
ship_in_progress.upgrades.forEach(upgrade =>{
   let element = document.getElementById("empty");
   if(upgrade.characteristics != null && upgrade.characteristics.includes("Dual"))//If it is a dual upgrade, show the first side of that upgrade.
   {
    element.style.backgroundImage = "url('"+upgrade.image_path.split("\n")[0]+"')";
    element.style.border = "3px solid red";
   }
   else
   {
    element.style.backgroundImage = "url('"+upgrade.image_path+"')";
   }
   element.addEventListener("click",function(){ //When you click each taken upgrade, you will be asked if you want to delete the upgrade.
      let overlay = document.getElementById("overlay");
      let upgrade_removal_box = document.getElementById("upgrade-removal-box");
      overlay.style.opacity = 1;
      upgrade_removal_box.style.visibility = "visible";
      overlay.style.pointerEvents = "all";
      if(upgrade.characteristics != null && upgrade.characteristics.includes("Dual"))//If a dual sided upgrade is being deleted, split path to get only first side of upgrade.
      {
        document.getElementById("upgrade-photo").style.backgroundImage = "url('"+upgrade.image_path.split("\n")[0]+"')";
        document.getElementById("upgrade-photo").style.border = "3px solid red";
        document.getElementById("flip-button").style.visibility = "visible";
      }
      else
      {
        document.getElementById("upgrade-photo").style.backgroundImage = "url('"+upgrade.image_path+"')";
        document.getElementById("upgrade-photo").style.border = "1px solid white";
      }
      document.getElementById("upgrade-photo").setAttribute('name', upgrade.name);//This is so when a user presses yes to delete, we can get the name of the upgrade.
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
  window.location.href = "";
})


//If you press the no button when asked if you want to delete an upgrade.
document.getElementById("no-button").addEventListener("click",function(){
  let overlay = document.getElementById("overlay");
  let upgrade_removal_box = document.getElementById("upgrade-removal-box");
  overlay.style.opacity = 0;
  upgrade_removal_box.style.visibility = "hidden";
  overlay.style.pointerEvents = "none";
  document.getElementById("flip-button").style.visibility = "hidden";
})
//If you press the yes button when asked if you want to delete an upgrade.
function remove_upgrade()
{
  let overlay = document.getElementById("overlay");
  let upgrade_removal_box = document.getElementById("upgrade-removal-box");
  overlay.style.opacity = 0;
  upgrade_removal_box.style.visibility = "hidden";
  overlay.style.pointerEvents = "none";
  document.getElementById("flip-button").style.visibility = "hidden";
  //get the name of the upgrade, remove it from the ship's list of upgrades, then reload the page.
  let upgrade_name = document.getElementById("upgrade-photo").getAttribute("name");
  for(var i =0; i < ship_in_progress.upgrades.length;i++)
  {
    if(ship_in_progress.upgrades[i].name == upgrade_name)
    {
     ship_in_progress.upgrades.splice(i,1);
     break;
    }
  }
    sessionStorage.setItem("all_teams",JSON.stringify(all_teams));
window.location.reload();
}

function flip_button_click()
{
  if(dual_card_back_showing == false)
  {
    let upgrade_name = document.getElementById("upgrade-photo").getAttribute("name");
    for(var i =0; i < ship_in_progress.upgrades.length;i++)
    {
      if(ship_in_progress.upgrades[i].name == upgrade_name)
      {
        document.getElementById("upgrade-photo").style.backgroundImage = "url('"+ship_in_progress.upgrades[i].image_path.split("\n")[1]+"')";
        dual_card_back_showing = true;
       break;
      }
    }
  }
  else
  {
    let upgrade_name = document.getElementById("upgrade-photo").getAttribute("name");
    for(var i =0; i < ship_in_progress.upgrades.length;i++)
    {
      if(ship_in_progress.upgrades[i].name == upgrade_name)
      {
        document.getElementById("upgrade-photo").style.backgroundImage = "url('"+ship_in_progress.upgrades[i].image_path.split("\n")[0]+"')";
        dual_card_back_showing = false;
       break;
      }
    }
  }
}