

var fdsnevent = seisplotjs_fdsnevent
var moment = fdsnevent.model.moment;
var daysAgo = 10;

var quakeQuery = new fdsnevent.EventQuery()
  .minMag(5.5)
  .startTime(moment.utc().subtract(daysAgo, 'days'))
  .endTime(moment.utc());
d3.select("div.recentQuakesUrl")
    .append("p")
    .text("URL: "+quakeQuery.formURL());
quakeQuery.query().then(function(quakes) {
  if (quakes.length == 0) {
    d3.select("div.recentQuakesUrl")
      .append("p")
      .text("Zero quakes returned... Sorry. ");
  }
  var table = d3.select("div.recentQuakes")
    .select("table");
  if ( table.empty()) {
    table = d3.select("div.recentQuakes")
      .append("table");
    var th = table.append("thead").append("tr");
    th.append("th").text("Time");
    th.append("th").text("Mag");
    th.append("th").text("Lat,Lon");
    th.append("th").text("Depth");
    th.append("th").text("Decription");
    table.append("tbody");
  }
  var tableData = table.select("tbody")
    .selectAll("tr")
    .data(quakes, function(d) {return d.time();});
  tableData.exit().remove();

  var tr = tableData
    .enter()
    .append("tr");

  tr.append("td")
    .text(function(d) {
      return d.time().toISOString();
      });
  tr.append("td")
    .text(function(d) {
      return d.magnitude().mag()+" "
          +d.magnitude().type();
      });
  tr.append("td")
    .text(function(d) {
      return "("+d.latitude()+", "+d.longitude()+")";
      });
  tr.append("td")
    .text(function(d) {
      return (d.depth()/1000)+"km ";
      });
  tr.append("td")
    .text(function(d) {
      return d.description();
      });

}, function(reason) {
d3.select("div.recentQuakes")
    .append("p")
    .text("Reject: "+reason);
});
