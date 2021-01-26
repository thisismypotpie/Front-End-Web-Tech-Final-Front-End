var setup_data = JSON.parse(sessionStorage.getItem("gc_setup_data"));
var game_data = JSON.parse(sessionStorage.getItem("game_data"));
var converted_planets = setup_data.converted_planets;

//For the border and collection of all elements.
var all_ship_body_elements = [];
var all_ship_body_border_colors = [];

for(var x=1; x < 201;x++)
{
   for(var y=1; y<101;y++)
   {
       var grid_coordinate = document.createElement("div");
       grid_coordinate.id = x+"_"+y;
       grid_coordinate.style.gridColumn = (x).toString();
       grid_coordinate.style.gridRow = (y).toString();
       grid_coordinate.style.backgroundSize = "100%  100%";
       grid_coordinate.style.backgroundRepeat = "no-repeat";
       //grid_coordinate.style.pointerEvents = "all";
       grid_coordinate.onmouseenter = function(e){document.getElementById(e.target.id).style.border = "1px solid green";};
       grid_coordinate.onmouseleave = function(e){document.getElementById(e.target.id).style.border = "none";};
       document.getElementById('grid-container').appendChild(grid_coordinate);
   }
}

//Load planets onto galaxy map.
load_planets();
add_path_dots();
place_ship_bodies();

function load_planets()
{
  setup_data.active_planets.forEach(planet=>{
          var id = planet.planet.x_coordinate+"_"+planet.planet.y_coordinate;
          if(planet.controlling_faction == "Unaligned")
          {
            document.getElementById(id).style.backgroundColor = "mediumblue";
            document.getElementById("faction-image").style.backgroundImage = "";
          }
          else if(planet.controlling_faction == "Rebels")
          {
            document.getElementById(id).style.backgroundColor = "maroon";
            document.getElementById("faction-image").style.backgroundImage = "url('https://i.imgur.com/h4bX7cy.png')";
          }
          else if(planet.controlling_faction == "Imperial")
          {
            document.getElementById(id).style.backgroundColor = "black";
            document.getElementById("faction-image").style.backgroundImage = "url('https://i.imgur.com/7BL338e.png')";
          }
          else
          {
            alert(planet.name+" has no readable alliance.  Error: "+planet.controlling_faction);
            document.getElementById(id).style.backgroundColor = "black";
          }
          document.getElementById(id).setAttribute("planet_id",planet.planet.id);//Used when searching for planets.

          //Add controls for when a player goes ever a planet.
          document.getElementById(id).onmouseover= function(e)
          {
            populate_planet_info_container(planet,e.target.id);
          };

          //Add controls for when the mouse leaves.
          document.getElementById(id).onmouseleave = function(e)
          {
            clear_planet_info_container(e.target.id);
          };
  })
}

function add_path_dots()
{
var game_data = JSON.parse(sessionStorage.getItem("game_data"));
game_data.map_paths.forEach(dot=>{
    var id_string = dot.x_coordinate+"_"+dot.y_coordinate;
    if(document.getElementById(id_string))
    {
      document.getElementById(id_string).style.backgroundImage = "url('https://i.imgur.com/lzfAvjE.png')";
    }
    else
    {
      rejected_ids.push(id_string);
    }
})
converted_planets.forEach(dot=>{//Turn each non-included planet into a path dot if they exist along a path.
  var id_string = dot.x_coordinate+"_"+dot.y_coordinate;
  if(document.getElementById(id_string))
  {
    document.getElementById(id_string).style.backgroundImage = "url('https://i.imgur.com/lzfAvjE.png')";
  }
})
}

function zoom_out_button_click()
{
    document.body.style.backgroundSize = "102% 130vh";
    document.getElementById("grid-container").style.gridTemplateColumns = "repeat(200,calc(100%/200))";
    document.getElementById("grid-container").style.gridTemplateRows = "repeat(100,calc(98vh/100))";
    document.getElementById("zoom-button").textContent = "Zoom In";
    document.getElementById("zoom-button").onclick = function(){zoom_in_button_click()};
} 

function zoom_in_button_click()
{
  document.body.style.backgroundSize = "408% 520vh";
  document.getElementById("grid-container").style.gridTemplateColumns = "repeat(200,calc(400%/200))";
  document.getElementById("grid-container").style.gridTemplateRows = "repeat(100,calc(392vh/100))";
  window.scrollBy(document.body.scrollHeight/2,document.body.scrollHeight/2);
  document.getElementById("zoom-button").onclick = function(){zoom_out_button_click()};
  document.getElementById("zoom-button").textContent = "Zoom Out"
}


function place_ship_bodies()
{
   let all_factions = JSON.parse(sessionStorage.getItem("gc_factions"));//[0] is rebels, [1] is empire.
   all_factions.forEach(faction=>{
     faction.navy.forEach(ship_body=>{
      var ship_element = document.createElement("div");
      ship_element.style.gridColumn = (ship_body.location.split("_")[0]).toString();
      ship_element.style.gridRow = (ship_body.location.split("_")[1]).toString();
      ship_element.style.backgroundImage = "url("+ship_body.image+")";
      ship_element.style.border = ship_body.border;
      ship_element.className = "ship-body";
      ship_element.id = ship_body.group_name;
      ship_element.style.pointerEvents = "all";
      ship_element.onclick = function(){/*Open ship body stats.*/};
      ship_element.onmouseenter = function(){check_if_planet_over_ship_body(ship_body.location);show_ship_body_stats()};
      ship_element.onmouseleave = function(){document.getElementById(ship_body.location).style.border = "none";clear_planet_info_container(ship_body.location);}
      all_ship_body_elements.push(ship_element.id);
      all_ship_body_border_colors.push(ship_body.border);
       document.getElementById('grid-container').appendChild(ship_element);
     })
   })
}

function check_if_planet_over_ship_body(planet_element_id)
{
  var planet_in_question  =get_planet(parseInt(document.getElementById(planet_element_id).getAttribute("planet_id"),10),0,setup_data.active_planets.length-1);
  if(planet_in_question !=null)
  {
    populate_planet_info_container(planet_in_question,planet_element_id);
  }
}

function show_ship_body_stats()
{

}

//Using binary search to get planet based on id.
function get_planet(id_goal,low_range_end,high_range_end)
{
    var test_index = Math.floor((low_range_end+high_range_end)/2);//Create average of low and high to test middle of active planets.
    var test_id = setup_data.active_planets[test_index].planet.id

    if( test_id == id_goal)
    {
        //planet found.
        return setup_data.active_planets[test_index];
    }
    else if(low_range_end == high_range_end)
    {
        //No match
        return null;
    }
    else if(id_goal> test_id)//get everything in upper half.
    {
        return get_planet(id_goal,test_index,high_range_end)
    }
    else//get everyting in lower half.
    {
        return get_planet(id_goal,low_range_end,test_index);
    }
}

function populate_planet_info_container(planet,element_id)
{
  document.getElementById(element_id).style.border = "1px solid green";
  document.getElementById("planet-name").textContent = planet.planet.name;
  document.getElementById("planet-image").style.backgroundImage = "url('"+planet.planet.image_path+"')";

 //Set up resouce image and quantity.
 document.getElementById("resource-image").style.backgroundImage = planet.resource.image_path;
 document.getElementById("resource-label").textContent="X"+planet.resource.quantity;

 //Set faction image for planet control.
  if(planet.controlling_faction == "Unaligned")
  {
    document.getElementById("faction-image").style.backgroundImage = "";
  }
  else if(planet.controlling_faction == "Rebels")
  {
    document.getElementById("faction-image").style.backgroundImage = "url('https://i.imgur.com/mO0iijb.png')";
  }
  else if(planet.controlling_faction == "Imperial")
  {
    document.getElementById("faction-image").style.backgroundImage = "url('https://i.imgur.com/XgIWtvd.png')";
  }
  else
  {
    alert(planet.name+" has no readable alliance.  Error: "+planet.controlling_faction);
  }
}

function clear_planet_info_container(id)
{
  document.getElementById(id).style.border = "none";
  document.getElementById("faction-image").style.backgroundImage ="";
  document.getElementById("planet-image").style.backgroundImage ="";
  document.getElementById("planet-name").textContent = "Planet";
  document.getElementById("resource-image").style.backgroundImage="";
  document.getElementById("resource-label").textContent = "X0";
}

//Blink the bordder every second.
setInterval(function(){ 
      for(var i=0;i<all_ship_body_elements.length;i++)
      {
        if(document.getElementById(all_ship_body_elements[i]).style.border == "none")
        {
          document.getElementById(all_ship_body_elements[i]).style.border = all_ship_body_border_colors[i];
        }
        else
        {
          document.getElementById(all_ship_body_elements[i]).style.border = "none";
        }
      }
}, 500);
