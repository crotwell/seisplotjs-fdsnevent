import * as model from 'seisplotjs-model';

import RSVP from 'rsvp';

export {RSVP, model };

export let QML_NS = 'http://quakeml.org/xmlns/quakeml/1.2';
export let BED_NS = 'http://quakeml.org/xmlns/bed/1.2';
export let IRIS_NS = 'http://service.iris.edu/fdsnws/event/1/';
export let ANSS_NS = 'http://anss.org/xmlns/event/0.1';
export let ANSS_CATALOG_NS = "http://anss.org/xmlns/catalog/0.1";

export let USGS_HOST = "earthquake.usgs.gov";

export class EventQuery {
  constructor(host) {
    this._protocol = 'http';
    this._host = host;
    if (! host) {
      this._host = USGS_HOST;
    }
  }
  protocol(value) {
    return arguments.length ? (this._protocol = value, this) : this._protocol;
  }
  host(value) {
    return arguments.length ? (this._host = value, this) : this._host;
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
  convertToQuake(qml) {
    let out = new model.Quake();
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
    return out;
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

  query() {
    let mythis = this;
//      return new RSVP.Promise(function(resolve, reject) {
    return this.queryRawXml().then(function(rawXml) {
        let top = rawXml.documentElement;
        let eventArray = top.getElementsByTagName("event");
        let out = [];
        for (let i=0; i<eventArray.length; i++) {
          out[i] = mythis.convertToQuake(eventArray.item(i));
        }
console.log("convert to quakes promis resolve: "+out.length);
        return out;
//resolve( out);
//      });
    });
  }

  queryRawXml() {
    let mythis = this;
    let promise = new RSVP.Promise(function(resolve, reject) {
      let client = new XMLHttpRequest();
      let url = mythis.formURL();
      client.open("GET", url);
      client.onreadystatechange = handler;
      client.responseType = "document";
      client.setRequestHeader("Accept", "application/xml");
      client.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) { resolve(this.responseXML); }
          else { reject(this); }
        }
      }
    });
    return promise;
  }

  formURL() {
    let url = this.protocol()+"://"+this.host()+"/fdsnws/event/1/query?";
    if (this._startTime) { url = url+"starttime="+this.toIsoWoZ(this.startTime())+"&";}
    if (this._endTime) { url = url+"endtime="+this.toIsoWoZ(this.endTime())+"&";}
    if (this._minMag) { url = url+"minmag="+this.minMag()+"&";}
    if (this._maxMag) { url = url+"maxmag="+this.maxMag()+"&";}
    if (this._minLat) { url = url+"minlat="+this.minLat()+"&";}
    if (this._maxLat) { url = url+"maxlat="+this.maxLat()+"&";}
    if (this._minLon) { url = url+"minlon="+this.minLon()+"&";}
    if (this._maxLon) { url = url+"maxlon="+this.maxLon()+"&";}
    return url.substr(0, url.length-1); // zap last & or ?
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
