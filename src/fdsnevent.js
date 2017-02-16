
import RSVP from 'rsvp';

export let USGS_HOST = "earthquake.usgs.gov";

export class Quake {
  constructor(json) {

  }
}

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
  convertToQuake(qml) {
    let out = {};
    out.description = qml.getElementsByTagName('description').item(0)
        .getElementsByTagName('text').item(0)
        .textContent;
    let otimeStr = qml.getElementsByTagName('origin').item(0)
        .getElementsByTagName('time').item(0)
        .getElementsByTagName('value').item(0)
        .textContent;
    if (! otimeStr.endsWith('Z')) {
      otimeStr = otimeStr+'Z';
    }
    out.time = new Date(Date.parse(otimeStr));
    out.latitude = parseFloat(qml.getElementsByTagName('origin').item(0)
        .getElementsByTagName('latitude').item(0)
        .getElementsByTagName('value').item(0)
        .textContent);
    out.longitude = parseFloat(qml.getElementsByTagName('origin').item(0)
        .getElementsByTagName('longitude').item(0)
        .getElementsByTagName('value').item(0)
        .textContent);
    out.depth = parseFloat(qml.getElementsByTagName('origin').item(0)
        .getElementsByTagName('depth').item(0)
        .getElementsByTagName('value').item(0)
        .textContent);
    out.magnitude = {
      type: qml.getElementsByTagName('magnitude').item(0)
        .getElementsByTagName('type').item(0)
        .textContent,
      value: parseFloat(qml.getElementsByTagName('magnitude').item(0)
        .getElementsByTagName('mag').item(0)
        .getElementsByTagName('value').item(0)
        .textContent)
    };
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
    return url.substr(0, url.length-1); // zap last & or ?
  }

  /** converts to ISO8601 but removes the trailing Z as FDSN web services 
    do not allow that. */
  toIsoWoZ(date) {
    let out = date.toISOString();
    return out.substring(0, out.length-1);
  }
}
