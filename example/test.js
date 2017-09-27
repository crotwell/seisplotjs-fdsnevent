

// this comes from the seisplotjs waveformplot bundle
var wp = seisplotjs_waveformplot
var traveltime = seisplotjs_traveltime
var fdsnevent = seisplotjs_fdsnevent
var daysAgo = 10;

var quakeQuery = new fdsnevent.EventQuery()
  .minMag(5.5)
  .startTime(new Date(new Date().getTime()-86400*daysAgo*1000))
  .endTime(new Date());
wp.d3.select("div.recentQuakesUrl")
    .append("p")
    .text("URL: "+quakeQuery.formURL());
quakeQuery.query().then(function(quakes) {
  if (quakes.length == 0) {
    wp.d3.select("div.recentQuakesUrl")
      .append("p")
      .text("Zero quakes returned... Sorry. ");
  }
  var table = wp.d3.select("div.recentQuakes")
    .select("table");
  if ( table.empty()) {
    table = wp.d3.select("div.recentQuakes")
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
    .append("button")
    .text("Plot")
    .on("click", function(d) {
      console.log("click "+d.time());
      plotEarthquake(d);
    });
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
wp.d3.select("div.recentQuakes")
    .append("p")
    .text("Reject: "+reason);
});

var plotEarthquake = function(eq) {
      wp.d3.select("div.seismograms")
        .selectAll("p")
        .remove();
      wp.d3.select("div.seismograms")
        .selectAll("p")
        .data([eq])
        .enter()
        .append("p")
        .text(function(d) {
          return "quake: "
              +d.time().toISOString()+" "
              +d.magnitude().mag()+" "
              +d.magnitude().type()+" "
              +"("+d.latitude()+", "+d.longitude()+") "
              +(d.depth()/1000)+"km "
              +d.description();
        });
       plotSeismograms(wp.d3.select("div.seismograms"),
                       "CO", "JSC", "00", "HHZ,HHN,HHE", eq);

}

var plotSeismograms = function(div, net, sta, loc, chan, quake) {
  div.selectAll('div.myseisplot').remove();
  var dur = 900;
  var host = 'service.iris.edu';
  var protocol = 'http:';
    if ("https:" == document.location.protocol) {
      protocol = 'https:'
    }
var jsclat = 34;
var jsclon = -81;
var pOffset = -120;
var clockOffset = 0; // set this from server somehow!!!!
    console.log("calc start end: "+quake.time()+" "+dur+" "+clockOffset);
    new traveltime.TraveltimeQuery()
        .evdepth(quake.depth()/1000)
        .evlat(quake.latitude()).evlon(quake.longitude())
        .stalat(jsclat).stalon(jsclon)
        .phases('p,P,PKP,PKIKP,Pdiff,s,S,Sdiff,PKP,SKS,SKIKS,PP,PcP,pP,sS,PKKP,SKKS,SS')
        .query()
        .then(function(ttimes) {
    var firstP = ttimes.arrivals[0];
    for (var p=0; p<ttimes.arrivals.length; p++) {
      if (firstP.time > ttimes.arrivals[p]) {
        firstP = ttimes.arrivals[p];
      }
    }
    var PArrival = new Date(quake.time().getTime()+(firstP.time+pOffset)*1000);
    var seisDates = wp.calcStartEndDates(PArrival, null, dur, clockOffset);
    var startDate = seisDates.start;
    var endDate = seisDates.end;

console.log("Start end: "+startDate+" "+endDate);
    var url = wp.formRequestUrl(protocol, host, net, sta, loc, chan, startDate, endDate);
console.log("Data request: "+url);
wp.loadParse(url, function (error, dataRecords) {
      if (error) {
        div.append('p').html("Error loading data." );
      } else if (dataRecords.length == 0) {
        div.append('p').html("No seismograms returned." );
      } else {
          div.selectAll('div.myseisplot').remove();
          var byChannel = wp.miniseed.byChannel(dataRecords);
          var keys = Array.from(byChannel.keys());
          console.log("Got "+dataRecords.length+" data records for "+keys.length+" channels");
          for (var key of byChannel.keys()) {
            var segments = wp.miniseed.merge(byChannel.get(key));
            div.append('p').html('Plot for ' + key);
            var svgdiv = div.append('div').attr('class', 'myseisplot');
            if (segments.length > 0) {
                var seismogram = new wp.chart(svgdiv, segments, startDate, endDate);
                var markers = [];
                for (var m=0;m<ttimes.arrivals.length; m++) {
                  markers.push({ name: ttimes.arrivals[m].phase, time: new Date(quake.time().getTime()+(ttimes.arrivals[m].time)*1000) });
                }
                seismogram.appendMarkers(markers);
                seismogram.draw();
            }
        }
        if (keys.length==0){
            divs.append('p').html('No data found');
        }
      }
    });
    });
}
