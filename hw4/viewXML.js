/**
 * Created by YiLIU on 10/23/15.
 */
function viewXML(what) {
     function loadXML() {
         var url = what.URL.value;
         // For IE7+, Firfox, CHrome, Opera, Safari
         if (window.XMLHttpRequest) {
             xmlhttp = new XMLHttpRequest();
         } else {
             // For IE6, IE5
             xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
         }
         xmlhttp.open("GET", url, false);
         xmlhttp.send();
         xmlDoc = xmlhttp.responseXML;
         return xmlDoc;
     }
    var xmlDoc = loadXML();

    if (window.ActiveXObject) {
        if (xmlDoc.parseError.errorCode != 0) {
            var myErr = xmlDoc.parseError;
            generateError(xmlDoc);
            hWin = window.open("", "Error", "height=300, width=340");
            hWin.document.write(html_text);
        } else {
            generateHTML(xmlDoc);
            hWin = window.open("", "Assignment4", "height=800, width=600");
            hWin.document.write(heml_text);
        }
    } else {
        var html_text = generateHTML(xmlDoc);
        var hWin = window.open("", "Assignment4", "height=800, width=600");
        hWin.document.write(html_text);
    }
    hWin.document.close();

}

function generateHTML(xmlDoc) {
    var ELEMENT_NODE = 1;
    var root = xmlDoc.DocumentElement;
    var html_text = "<html><head><tittle>XML Parse Result</tittle></head><body>";
    html_text += "<table border='2'>";

    var listings = xmlDoc.childNodes[0].childNodes;
    html_text += "<tbody>";
    // output the headers
    for (i = 0; i < listings.length; i++) {
        var listing = listings[i].childNodes;
        if (listing.length == 0) {
            continue;
        }
        html_text += "<tr><th colspan='7'>Listing</th></tr><tr>"
        for (j = 0; j < listing.length; j++) {
            if (listing[j].nodeName == "Location") {
                var location = listing[j].childNodes;
                if (location.length == 0) {
                    continue;
                }
                html_text += "<th>Location</th>";
                html_text += parseTable(location);
                html_text += "</tr>";
            }
            if (listing[j].nodeName == "ListingDetails") {
                var details = listing[j].childNodes;
                if (details.length == 0) {
                    continue;
                }
                html_text += "<th>Details</th>"
                html_text += parseTable(details);
                html_text += "</tr>"
            }
        }
        html_text += "</tr>";
    }
    // output out the values
    html_text += "</tbody>";
    html_text += "</table>";
    html_text += "</body></html>";

    return html_text;
}

function parseTable(arr) {
    var ans = "";
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].firstChild == null) {
            continue;
        }
        if (arr[i].nodeName == "Image") {
            ans += "<th colspan='3'>" + arr[i].nodeName + "</th>";
        } else {
            ans += "<th>" + arr[i].nodeName + "</th>";
        }
    }
    ans += "</tr><tr><th></th>";
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].firstChild == null) {
            continue;
        }
        if (arr[i].nodeName == "Image") {
            ans += "<th colspan='3'><img src='" + arr[i].firstChild.nodeValue + "' width='280' height='180' /></th>";
        } else if (arr[i].nodeName == "ListingUrl") {
            ans += "<th><a href=" + arr[i].firstChild.nodeValue + ">Link to listing</a></th>";
        }
        else {
            ans += "<th>" + arr[i].firstChild.nodeValue + "</th>";
        }
    }

    return ans;
}
