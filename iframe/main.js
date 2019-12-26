function get_full_url(url_path)
{
    var loc = window.location;
    var url = "" + loc.protocol + "//" + loc.host + url_path;
    return url;
}

function refresh_page_absolute(url_path)
{
    window.location.href = get_full_url(url_path)
}



function wizard() {
  var iframe = document.createElement('iframe');
  var backbtn = document.createElement('button');
  var site = document.getElementById("sitebox").value;
  if (site == "") {
    site = "https://bing.com"
  }
  else if (site.includes("http") ==! true){
    site = "https://"+site
  }
  var html = '<iframe src="' + site + '" scrolling="no" width="100%" height="100%" ></iframe>';
  html = html + '<button onclick="location.reload();" id="sitebutton" style="position:absolute; right: 0px; ';
  html = html + 'margin: 8 6; top: 0px;"">Refresh</button>';
  iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
  document.body.appendChild(iframe);

  //var html2 = '<button onclick="location.reload();" id="backbutton" style="position:absolute; right: 0px; ';
  //html2 = html2 + 'margin: 8 6; top: 0px;"">Back</button>';

  //backbtn.src = 'data:text/html;charset=utf-8,' + encodeURI(html2);
  backbtn.innerHTML = "Back";
  backbtn.addEventListener ("click", function() {location.reload();});
  backbtn.style = "position:absolute; right: 12px; top: 8px;";
  //backbtn.style.margin = "";
  document.body.appendChild(backbtn);

  var element = document.getElementById("sitebox");
  element.parentNode.removeChild(element);
  var element = document.getElementById("sitebutton");
  element.parentNode.removeChild(element);
}
