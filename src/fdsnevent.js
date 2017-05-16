import * as model from 'seisplotjs-model';

import RSVP from 'rsvp';

export {RSVP, model };

export let QML_NS = 'http://quakeml.org/xmlns/quakeml/1.2';
export let BED_NS = 'http://quakeml.org/xmlns/bed/1.2';
export let IRIS_NS = 'http://service.iris.edu/fdsnws/event/1/';
export let ANSS_NS = 'http://anss.org/xmlns/event/0.1';
export let ANSS_CATALOG_NS = "http://anss.org/xmlns/catalog/0.1";

export let USGS_HOST = "earthquake.usgs.gov";

export const FAKE_EMPTY_XML = '<?xml version="1.0"?><q:quakeml xmlns="http://quakeml.org/xmlns/bed/1.2" xmlns:q="http://quakeml.org/xmlns/quakeml/1.2"><eventParameters publicID="quakeml:fake/empty"></eventParameters></q:quakeml>';

export class EventQuery {
  constructor(host) {
    this._specVersion = 1;
    this._protocol = 'http:';
    this._host = host;
    if (! host) {
      this._host = USGS_HOST;
    }
  }
  specVersion(value) {
    return arguments.length ? (this._specVersion = value, this) : this._specVersion;
  }
  protocol(value) {
    return arguments.length ? (this._protocol = value, this) : this._protocol;
  }
  host(value) {
    return arguments.length ? (this._host = value, this) : this._host;
  }
  nodata(value) {
    return arguments.length ? (this._nodata = value, this) : this._nodata;
  }
  eventid(value) {
    return arguments.length ? (this._eventid = value, this) : this._eventid;
  }
  startTime(value) {
    return arguments.length ? (this._startTime = value, this) : this._startTime;
  }
  endTime(value) {
    return arguments.length ? (this._endTime = value, this) : this._endTime;
  }
  minMag(value) {
    return arguments.length ? (this._minMag = value, this) : this._minMag;
  }
  maxMag(value) {
    return arguments.length ? (this._maxMag = value, this) : this._maxMag;
  }
  minLat(value) {
    return arguments.length ? (this._minLat = value, this) : this._minLat;
  }
  maxLat(value) {
    return arguments.length ? (this._maxLat = value, this) : this._maxLat;
  }
  minLon(value) {
    return arguments.length ? (this._minLon = value, this) : this._minLon;
  }
  maxLon(value) {
    return arguments.length ? (this._maxLon = value, this) : this._maxLon;
  }
  includearrivals(value) {
    return arguments.length ? (this._includearrivals = value, this) : this._includearrivals;
  }
  
  convertToQuake(qml) {
    let out = new model.Quake();
    out.publicID = qml.getAttribute('publicID');
    out.description(this._grabFirstElText(this._grabFirstEl(qml, 'description'), 'text'));
    let otimeStr = this._grabFirstElText(this._grabFirstEl(this._grabFirstEl(qml, 'origin'), 'time'),'value');
    if (otimeStr ) {
      out.time(this.toDateUTC(otimeStr));
    } else {
      console.log("origintime is missing..."+out.description());
    }
    out.latitude(this._grabFirstElFloat(this._grabFirstEl(this._grabFirstEl(qml, 'origin'), 'latitude'), 'value'));
    out.longitude(this._grabFirstElFloat(this._grabFirstEl(this._grabFirstEl(qml, 'origin'), 'longitude'), 'value'));
    out.depth(this._grabFirstElFloat(this._grabFirstEl(this._grabFirstEl(qml, 'origin'), 'depth'), 'value'));
    out.magnitude(this.convertToMagnitude(this._grabFirstEl(qml, 'magnitude')));
    let allPickEls = qml.getElementsByTagNameNS(BED_NS, 'pick');
    let allPicks = [];
    for (let pNum=0; pNum < allPickEls.length; pNum++) {
      allPicks.push(this.convertToPick(allPickEls.item(pNum)));
    }
    let allArrivalEls = qml.getElementsByTagNameNS(BED_NS, 'arrival');
    let allArrivals = [];
    for ( let aNum=0; aNum < allArrivalEls.length; aNum++) {
      allArrivals.push(this.convertToArrival(allArrivalEls.item(aNum), allPicks));
    }
    out.arrivals(allArrivals);
    out.eventid(this.extractEventId(qml));
    return out;
  }
  extractEventId(qml) {
    let eventid = qml.getAttributeNS(ANSS_CATALOG_NS, 'eventid');
    let catalogEventSource = qml.getAttributeNS(ANSS_CATALOG_NS, 'eventsource');
    if (eventid) { 
      if (this.host() === USGS_HOST && catalogEventSource) {
        // USGS, NCEDC and SCEDC use concat of eventsource and eventid as eventit, sigh...
        return catalogEventSource+eventid;
      } else {
        return eventid;
      }
    }
    let publicid = qml.getAttribute('publicID');
    let re = /eventid=([\w\d]+)/;
    let parsed = re.exec(publicid);
    if (parsed) { return parsed[1];}
    re = /evid=([\w\d]+)/;
    parsed = re.exec(publicid);
    if (parsed) { return parsed[1];}
//    throw new Error("Unable to find eventid for publicID="+publicid);
    return null;
  }
  convertToMagnitude(qml) {
    let mag = this._grabFirstElFloat(this._grabFirstEl(qml, 'mag'), 'value');
    let type = this._grabFirstElText(qml, 'type');
    let out = null;
    if (mag && type) {
      out = new model.Magnitude(mag, type);
    }
    return out;
  }
  convertToArrival(arrivalQML, allPicks) {
    let pickID = this._grabFirstElText(arrivalQML, 'pickID');
    let phase = this._grabFirstElText(arrivalQML, 'phase');
    return new model.Arrival(phase, allPicks.find(function(p) { return p.publicID() == pickID;}));
  }
  convertToPick(pickQML) {
    let otimeStr = this._grabFirstElText(this._grabFirstEl(pickQML, 'time'),'value');
    let time = this.toDateUTC(otimeStr);
    let waveformIDEl = this._grabFirstEl(pickQML, 'waveformID');
    let netCode = waveformIDEl.getAttribute("networkCode");
    let stationCode = waveformIDEl.getAttribute("stationCode");
    let locationCode = waveformIDEl.getAttribute("locationCode");
    let channelCode = waveformIDEl.getAttribute("channelCode");
    let out = new model.Pick(time, netCode, stationCode, locationCode, channelCode);
    out.publicID(pickQML.getAttribute("publicID"));
    return out;
  }

  query() {
    let mythis = this;
    return this.queryRawXml().then(function(rawXml) {
        return mythis.parseQuakeML(rawXml);
    });
  }

  parseQuakeML(rawXml) {
    let top = rawXml.documentElement;
    let eventArray = top.getElementsByTagName("event");
    let out = [];
    for (let i=0; i<eventArray.length; i++) {
      out[i] = this.convertToQuake(eventArray.item(i));
    }
    return out;
  }

  queryRawXml() {
    let mythis = this;
    let promise = new RSVP.Promise(function(resolve, reject) {
      let client = new XMLHttpRequest();
      let url = mythis.formURL();
      client.open("GET", url);
      client.onreadystatechange = handler;
      client.responseType = "text";
      client.setRequestHeader("Accept", "application/xml");
      client.send();

      function handler() {
        if (this.readyState === this.DONE) {
          console.log("handle: "+mythis.host()+" "+this.status);
          if (this.status === 200) {
            let out = new DOMParser().parseFromString(this.response, "text/xml");
            out.url = url;
            resolve(out);
//            resolve(this.responseXML);
          } else if (this.status === 204 || (mythis.nodata() && this.status === mythis.nodata())) {

            // 204 is nodata, so successful but empty
            if (DOMParser) {
console.log("204 nodata so return empty xml");
              resolve(new DOMParser().parseFromString(FAKE_EMPTY_XML, "text/xml"));
            } else {
              throw new Error("Got 204 but can't find DOMParser to generate empty xml");
            }
          } else { 
            console.log("Reject: "+mythis.host()+" "+this.status);reject(this); 
          }
        }
      }
    });
    return promise;
  }


  formBaseURL() {
      let colon = ":";
      if (this.protocol().endsWith(colon)) {
        colon = "";
      }      return this.protocol()+colon+"//"+this.host()+"/fdsnws/event/"+this.specVersion();
  }

  formCatalogsURL() {
    return this.formBaseURL()+"/catalogs";
  }
  queryCatalogs() {
    let mythis = this;
    let promise = new RSVP.Promise(function(resolve, reject) {
      let url = mythis.formCatalogsURL();
      let client = new XMLHttpRequest();
      client.open("GET", url);
      client.onreadystatechange = handler;
      client.responseType = "document";
      client.setRequestHeader("Accept", "application/xml");
      client.send();

      function handler() {
        if (this.readyState === this.DONE) {
          console.log("handle catalogs: "+mythis.host()+" "+this.status);
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(this);
          }
        }
      }
    });
    return promise.then(function(rawXml) {
        let top = rawXml.documentElement;
        let catalogArray = top.getElementsByTagName("Catalog");
        let out = [];
        for (let i=0; i<catalogArray.length; i++) {
          out[i] = catalogArray.item(i).textContent;
        }
        return out;
    });
  }

  formContributorsURL() {
    return this.formBaseURL()+"/contributors";
  }
  queryContributors() {
    let mythis = this;
    let promise = new RSVP.Promise(function(resolve, reject) {
      let url = mythis.formContributorsURL();
      let client = new XMLHttpRequest();
      client.open("GET", url);
      client.onreadystatechange = handler;
      client.responseType = "document";
      client.setRequestHeader("Accept", "application/xml");
      client.send();

      function handler() {
        if (this.readyState === this.DONE) {
          console.log("handle contributors: "+mythis.host()+" "+this.status);
          if (this.status === 200) { resolve(this.response); }
          else {
            console.log("Reject contributors: "+mythis.host()+" "+this.status);reject(this); }
        }
      }
    });
    return promise.then(function(rawXml) {
        let top = rawXml.documentElement;
        let contribArray = top.getElementsByTagName("Contributor");
        let out = [];
        for (let i=0; i<contribArray.length; i++) {
          out[i] = contribArray.item(i).textContent;
        }
        return out;
    });
  }

  formVersionURL() {
    return this.formBaseURL()+"/version";
  }

  queryVersion() {
    let mythis = this;
    let promise = new RSVP.Promise(function(resolve, reject) {
      let url = mythis.formVersionURL();
      let client = new XMLHttpRequest();
      client.open("GET", url);
      client.onreadystatechange = handler;
      client.responseType = "text";
      client.setRequestHeader("Accept", "text/plain");
      client.send();

      function handler() {
        if (this.readyState === this.DONE) {
          console.log("handle version: "+mythis.host()+" "+this.status);
          if (this.status === 200) { resolve(this.response); }
          else {
            console.log("Reject version: "+mythis.host()+" "+this.status);reject(this); }
        }
      }
    });
    return promise;
  }

  makeParam(name, val) {
    return name+"="+encodeURIComponent(val)+"&";
  }

  _isDef(v) {
    return v || v === 0;
  }

  formURL() {
    let colon = ":";
    if (this.protocol().endsWith(colon)) {
      colon = "";
    }
    let url = this.formBaseURL()+"/query?";
    if (this._eventid) { url = url+this.makeParam("eventid", this.eventid());}
    if (this._startTime) { url = url+this.makeParam("starttime", this.toIsoWoZ(this.startTime()));}
    if (this._endTime) { url = url+this.makeParam("endtime", this.toIsoWoZ(this.endTime()));}
    if (this._isDef(this._minMag)) { url = url+this.makeParam("minmag", this.minMag());}
    if (this._isDef(this._maxMag)) { url = url+this.makeParam("maxmag", this.maxMag());}
    if (this._isDef(this._minLat)) { url = url+this.makeParam("minlat", this.minLat());}
    if (this._isDef(this._maxLat)) { url = url+this.makeParam("maxlat", this.maxLat());}
    if (this._isDef(this._minLon)) { url = url+this.makeParam("minlon", this.minLon());}
    if (this._isDef(this._maxLon)) { url = url+this.makeParam("maxlon", this.maxLon());}
    if (this._includearrivals) { 
      if (this.host() != USGS_HOST) {
        url = url+"includearrivals=true&";
      } else {
        // USGS does not support includearrivals, but does actually
        // include the arrivals for an eventid= style query
        if (this._eventid) {
          // ok, works without the param
        } else {
          throw new Error("USGS host, earthquake.usgs.gov, does not support includearrivals parameter.");
        }
      }
    }
    if (url.endsWith('&') || url.endsWith('?')) {
      url = url.substr(0, url.length-1); // zap last & or ?
    }
    return url;
  }

  // these are similar methods as in seisplotjs-fdsnstation
  // duplicate here to avoid dependency and diff NS, yes that is dumb...


  toDateUTC(str) {
    if (! str.endsWith('Z')) {
      str = str + 'Z';
    }
    return new Date(Date.parse(str));
  }

  /** converts to ISO8601 but removes the trailing Z as FDSN web services 
    do not allow that. */
  toIsoWoZ(date) {
    let out = date.toISOString();
    return out.substring(0, out.length-1);
  }

  _grabFirstEl(xml, tagName) {
    if ( ! xml) { return null;}
    let out = xml.getElementsByTagNameNS(BED_NS, tagName);
    if (out && out.length > 0) {
      return out.item(0);
    } else {
      return null;
    }
  }

  _grabFirstElText(xml, tagName) {
    let out = this._grabFirstEl(xml, tagName);
    if (out) {
      out = out.textContent;
    }
    return out;
  }

  _grabFirstElFloat(xml, tagName) {
    let out = this._grabFirstElText(xml, tagName);
    if (out) {
      out = parseFloat(out);
    }
    return out;
  }
}
