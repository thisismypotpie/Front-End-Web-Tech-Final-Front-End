function check_for_death()
{
    if(all_teams[team_index].ship_list[selected_ship_index].chosen_pilot.ship_name.ship_type == "largeTwoCard")
    {
        var aft_gone = false;
        var fore_gone = false
        if(all_teams[team_index].ship_list[selected_ship_index].current_hull <= 0)
        {
            fore_gone = true;
            all_teams[team_index].ship_list[selected_ship_index].current_attack = all_teams[team_index].ship_list[selected_ship_index].chosen_pilot.ship_name.crippled_attack;
            all_teams[team_index].ship_list[selected_ship_index].current_agility = 0;
            all_teams[team_index].ship_list[selected_ship_index].current_hull = 0;
            all_teams[team_index].ship_list[selected_ship_index].current_sheilds = 0;
            if(all_teams[team_index].ship_list[selected_ship_index].aft_showing == false)
            {
                pilot_image.style.backgroundImage = "url('"+all_teams[team_index].ship_list[selected_ship_index].chosen_pilot.fore_crippled_path+"')";
            }
        }
        if(all_teams[team_index].ship_list[selected_ship_index].current_aft_hull <= 0)
        {
            aft_gone = true;
            all_teams[team_index].ship_list[selected_ship_index].current_energy = all_teams[team_index].ship_list[selected_ship_index].chosen_pilot.ship_name.crippled_energy;
            all_teams[team_index].ship_list[selected_ship_index].current_aft_agility = 0;
            all_teams[team_index].ship_list[selected_ship_index].current_aft_hull = 0;
            all_teams[team_index].ship_list[selected_ship_index].current_aft_sheilds = 0;
            if(all_teams[team_index].ship_list[selected_ship_index].aft_showing == true)
            {
                pilot_image.style.backgroundImage = "url('"+all_teams[team_index].ship_list[selected_ship_index].chosen_pilot.aft_crippled_path+"')";
            }
        }
        if(aft_gone == true && fore_gone == true)
        {
            document.getElementById('kaboom-button').style.visibility = 'visible';
            show_pop_up('ship-death-pop-up');
        }
    }
    else
    {
        if(all_teams[team_index].ship_list[selected_ship_index].current_hull <= 0)
        {
            show_pop_up('ship-death-pop-up');
        }
    }
}

function ship_is_dead()
{
    hide_pop_up('ship-death-pop-up');
    discard_related_target_locks();//This will make sure that any target lock associated with the dead ship is removed.
    var ship_to_be_removed = all_teams[team_index].ship_list[selected_ship_index];
    all_teams[team_index].ship_list.splice(selected_ship_index,1);
    sessionStorage.setItem("all_teams",JSON.stringify(all_teams));
    var game_over = false; 

    if(sessionStorage.getItem("gc_setup_data")!=null)
    {
        gc_check_for_adding_to_list_of_the_dead(ship_to_be_removed);
    }

    if(all_teams[team_index].ship_list.length == 0)
    {
        if(sessionStorage.getItem("gc_setup_data")!=null)//If you are playing galactic conquest, then add removed team to combat report.
        {
            //put destroyed team into the combat report.
            var combat_report = [];
            if(sessionStorage.getItem("combat_report") == null)
            {
                sessionStorage.setItem("combat_report",JSON.stringify([]));
            }
            else
            {   
                combat_report = JSON.parse(sessionStorage.getItem("combat_report"));
            }
    
            combat_report.push(
                {team_name: all_teams[team_index].team_name,
                team_remnant: null,
                outcome:"Defeated"
            })
            sessionStorage.setItem("combat_report",JSON.stringify(combat_report));
        }
        //Team is out of the game.
        var team_name = all_teams[team_index].team_name;
        all_teams.splice(team_index,1);
        if(team_index >= all_teams.length)//Just in case the last team in the list is eliminated first.
        {
            team_index = all_teams.length -1;
            sessionStorage.setItem("team_index",team_index);
        }
        sessionStorage.setItem("all_teams",JSON.stringify(all_teams));
        document.getElementById('notification-pop-up-title').textContent = team_name+" has been eliminated from the game!";
        document.getElementById('notificatin-ok-button').onclick = function(){location.reload();};
        show_pop_up("Notification-pop-up");
        if(all_teams.length <=1)
        {
            game_over = true;
        }
        else
        {
            return;
        }
    }
    if(all_teams.length == 0 || game_over == true)
    {
        //game over.
        if(all_teams.length == 0)
        {
            document.getElementById('notification-pop-up-title').textContent = "All teams eliminated! \n GAME OVER!";
        }
        else
        {
            document.getElementById('notification-pop-up-title').textContent = all_teams[team_index].team_name+" is victorious! \n GAME OVER!";
        }
        show_pop_up("Notification-pop-up");
        if(sessionStorage.getItem("combat_report")!=null)//for galactic conquest.
        {
            var combat_report = JSON.parse(sessionStorage.getItem("combat_report"));
            combat_report.push(
                {team_name: all_teams[0].team_name,
                team_remnant: all_teams[0].ship_list,
                outcome:"Victory"
            })
            sessionStorage.setItem("combat_report",JSON.stringify(combat_report));
            //sessionStorage.removeItem("all_teams_names");
            sessionStorage.removeItem("team_index");
            sessionStorage.removeItem("selected_ship_index");
            sessionStorage.removeItem("all_target_locks");
            sessionStorage.removeItem("phase");
            sessionStorage.removeItem("movement_attack_index");
            sessionStorage.removeItem("selected_ship_storage");
            sessionStorage.removeItem("all_teams");

            document.getElementById('notificatin-ok-button').onclick = function(){window.location.href = "../../Galactic-Conquest-Screens/Gameplay-Screens/gameplay-screen.html"};
        }
        else
        {
            document.getElementById('notificatin-ok-button').onclick = function(){window.location.href = "../../Team-Screen/Team-Screen.html"};
            sessionStorage.clear();
            sessionStorage.setItem("game_data",JSON.stringify(game_data));
            if(all_teams.length > 0)
            {
                sessionStorage.setItem("all_teams",JSON.stringify(all_teams));
            }
        }
    }
    else//cases for moving to the next team if the ship team needs to be moved to.
    {
        if(sessionStorage.getItem("searching")!=null && sessionStorage.getItem("searching")!= undefined)//Just in case someone is searching when a another ship dies.
        {
            sessionStorage.setItem("team_index",sessionStorage.getItem("saved_team_index"));
            sessionStorage.setItem("selected_ship_index",sessionStorage.getItem("saved_ship_index"));
            sessionStorage.removeItem("saved_team_index");
            sessionStorage.removeItem("saved_ship_index");
            sessionStorage.removeItem("searching");
        }
        if(team_index >= (all_teams.length-1) &&
           selected_ship_index >= (all_teams[team_index].ship_list.length)&&
           (sessionStorage.getItem("phase")==null &&
           sessionStorage.getItem("phase")==undefined))//If the last ship in the entire list has been removed, move to maneuver phase instead of trying to go back to the last ship.
        {
            alert("moving to movement phase.");
            sessionStorage.setItem("phase","movement");
            sessionStorage.setItem("movement_attack_index",0);
            sessionStorage.removeItem("team_index");
            sessionStorage.removeItem("selected_ship_index");
        }
        if(sessionStorage.getItem("phase")!=null &&
            sessionStorage.getItem("phase")!=undefined)
        {
            if(get_total_ships(all_teams)<= (parseInt(sessionStorage.getItem("movement_attack_index"),10)))//If the last ship in the movement phase is killed.
            {
                alert("resetting movement attack index.");
                sessionStorage.setItem("movement_attack_index",(get_total_ships(all_teams)-1));
                sessionStorage.setItem("phase","attack");
            }
        }
        //If in maneuver selection phase and the final ship of a team dies, move to the next team in maneuver selection phase
        if(sessionStorage.getItem("phase") == null &&
           selected_ship_index == all_teams[team_index].ship_list.length &&
           team_index < (all_teams.length-1))
        {
            team_index++;
            selected_ship_index = 0;
            sessionStorage.setItem("selected_ship_index",selected_ship_index);
            sessionStorage.setItem("team_index",team_index);
        }
        location.reload();
    }
}

function revive_ship()
{
    all_teams[team_index].ship_list[selected_ship_index].current_hull =1;
    if(all_teams[team_index].ship_list[selected_ship_index].chosen_pilot.ship_name.ship_type == "largeTwoCard" &&
    all_teams[team_index].ship_list[selected_ship_index].aft_showing == true)//Reset a two sided card back to the front.
    {
        all_teams[team_index].ship_list[selected_ship_index].aft_showing = false;
    }
    sessionStorage.setItem("all_teams",JSON.stringify(all_teams)); 
    location.reload();
}

function play_death_music()
{
    var death_music_chance = Math.floor(Math.random() * 11);
    if(death_music_chance == 10)
    {
        var minion_ship_death = new Audio('https://docs.google.com/uc?export=download&id=1l3iV5tbP4xIg_4Y0q4f7eDGxbGkyv-W1');
        minion_ship_death.play();
    }
    else
    {
        var regular_ship_death =  new Audio('https://docs.google.com/uc?export=download&id=1Id2DleeQ8isNQibcCOsHyvlyO2iIsWDc');
        regular_ship_death.play();       
    }
}

    //        var chosen_index = game_data.all_large_crit_hit_cards.map(function(e){return e.id}).indexOf(crit_hit_assign_index);
    //&& (ship_to_be_removed.chosen_pilot.is_unique == true
function gc_check_for_adding_to_list_of_the_dead(ship_to_inspect)
{
    var all_factions = JSON.parse(sessionStorage.getItem("gc_factions"));
    var setup_data = JSON.parse(sessionStorage.getItem("gc_setup_data")); 

    //Check if ship had unique pilot.
    if(ship_to_inspect.chosen_pilot.is_unique == true)
    {
        if(ship_to_inspect.chosen_pilot.faction == "Rebels" &&
           !all_factions[0].list_of_the_fallen.includes(ship_to_inspect.chosen_pilot.pilot_name))
        {
            all_factions[0].list_of_the_fallen.push(ship_to_inspect.chosen_pilot.pilot_name);
        }
        else if(ship_to_inspect.chosen_pilot.faction == "Imperial" &&
                !all_factions[1].list_of_the_fallen.includes(ship_to_inspect.chosen_pilot.pilot_name))
        {
            all_factions[1].list_of_the_fallen.push(ship_to_inspect.chosen_pilot.pilot_name);
        }
        else if(ship_to_inspect.chosen_pilot.faction == "Scum" &&
                !setup_data.pirate_options.list_of_the_dead.includes(ship_to_inspect.chosen_pilot.pilot_name))
        {
            !setup_data.pirate_options.list_of_the_dead.push(ship_to_inspect.chosen_pilot.pilot_name);
        }
        else
        {
            alert("ERROR: Cannot determine which faction the destroyed ship is from.");
        }
    }

    //Check if upgrades had unique character. 
    ship_to_inspect.upgrades.forEach(upgrade=>{
        if((upgrade.upgrade.type == "Crew" || upgrade.upgrade.type == "Astromech" || upgrade.upgrade.type =="Salvaged Astromech")&& 
            upgrade.upgrade.is_unique == true)
            {
                    if(ship_to_inspect.chosen_pilot.faction == "Rebels" &&
                    !all_factions[0].list_of_the_fallen.includes(upgrade.upgrade.name))
                    {
                         all_factions[0].list_of_the_fallen.push(upgrade.upgrade.name);
                    }
                else if(ship_to_inspect.chosen_pilot.faction == "Imperial" &&
                        !all_factions[1].list_of_the_fallen.includes(upgrade.upgrade.name))
                    {
                        all_factions[1].list_of_the_fallen.push(upgrade.upgrade.name);
                    }
                else if(ship_to_inspect.chosen_pilot.faction == "Scum" &&
                        !setup_data.pirate_options.list_of_the_dead.includes(upgrade.upgrade.name))
                    {
                      setup_data.pirate_options.list_of_the_dead.push(upgrade.upgrade.name);
                    }
                else
                    {
                     alert("ERROR: Cannot determine which faction the destroyed ship is from.");
                    }
            }
    })

    sessionStorage.setItem("gc_factions",JSON.stringify(all_factions));
    sessionStorage.setItem("gc_setup_data",JSON.stringify(setup_data));
}