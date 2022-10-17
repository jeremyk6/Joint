points_filename = null
points = null

function downloadJSON(name, data) {
  data = JSON.stringify(data)
  data_holder = document.createElement('a');
  data_holder.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
  data_holder.setAttribute('download', name);
  data_holder.style.display = 'none';
  document.body.appendChild(data_holder);
  data_holder.click();
  document.body.removeChild(data_holder);
}

function loadPointsFile() {
  console.log("pouet")
  points_file = document.getElementById("points_input").files[0]
  points_reader = new FileReader();
  points_reader.readAsText(points_file);
  points_reader.onload = function() {
    points = JSON.parse(points_reader.result)
    points_filename = points_file.name
    document.getElementById("points_input_button").value = points_filename
    document.getElementById("start_button").style.display = 'grid'
  }
}

function selectFile() {
  document.getElementById("points_input").click()
}

async function fetchJSON(url) {
  response = await fetch(url)
  json = await response.json()
  return(json)
}

function process() {

    content = document.getElementById("start_button").value = "Chargement..."

    fetchJSON(document.getElementById("admin_input").value).then(function(admin) {

      tagged = turf.tag(points, admin, 'INSEE', 'admin_INSEE')

      p_name = points_filename.split('.')
      p_name.splice(-1)
      p_name = "NB_"+p_name.join('_').toUpperCase()
      for(feature of admin.features) {
        feature.properties[p_name] = tagged.features.filter(f => f.properties.admin_INSEE == feature.properties.INSEE).length
      }

      admin_text = document.getElementById('admin_input').options[document.getElementById('admin_input').selectedIndex].innerHTML.toUpperCase();
      downloadJSON(p_name+"_"+admin_text+".geojson", admin)

      document.getElementById("start_button").value = "Lancer"

    })
      
}

function init() {
  document.getElementById("points_input").value = null
}