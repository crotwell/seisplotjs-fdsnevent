// @flow

import * as model from 'seisplotjs-model';
import * as util from './util';

// special due to flow
import {hasArgs, hasNoArgs, isStringArg, isNumArg, checkStringOrDate, stringify} from 'seisplotjs-model';


import RSVP from 'rsvp';

RSVP.on('error', function(reason) {
  console.assert(false, reason);
});

export {RSVP, model };

export const moment = model.moment;

export let QML_NS = 'http://quakeml.org/xmlns/quakeml/1.2';
export let BED_NS = 'http://quakeml.org/xmlns/bed/1.2';
export let IRIS_NS = 'http://service.iris.edu/fdsnws/event/1/';
export let ANSS_NS = 'http://anss.org/xmlns/event/0.1';
export let ANSS_CATALOG_NS = "http://anss.org/xmlns/catalog/0.1";

export let USGS_HOST = "earthquake.usgs.gov";

export const FAKE_EMPTY_XML = '<?xml version="1.0"?><q:quakeml xmlns="http://quakeml.org/xmlns/bed/1.2" xmlns:q="http://quakeml.org/xmlns/quakeml/1.2"><eventParameters publicID="quakeml:fake/empty"></eventParameters></q:quakeml>';

export class EventQuery {
  /** @private */
  _specVersion: number;
  /** @private */
  _protocol: string;
  /** @private */
  _host: string;
  /** @private */
  _nodata: number;
  /** @private */
  _eventid: string;
  /** @private */
  _startTime: moment;
  /** @private */
  _endTime: moment;
  /** @private */
  _minMag: number;
  /** @private */
  _maxMag: number;
  /** @private */
  _minLat: number;
  /** @private */
  _maxLat: number;
  /** @private */
  _minLon: number;
  /** @private */
  _maxLon: number;
  /** @private */
  _latitude: number;
  /** @private */
  _longitude: number;
  /** @private */
  _minRadius: number;
  /** @private */
  _maxRadius: number;
  /** @private */
  _includearrivals: boolean;
  constructor(host?: string) {
    this._specVersion = 1;
    this._protocol = 'http:';
    if (document && document.location && "https:" === document.location.protocol) {
      this._protocol = 'https:'
    }
    this.host(host);
    if (! host) {
      this._host = USGS_HOST;
    }
  }
  specVersion(value?: number): number | EventQuery {
    if (hasArgs(value)) {
      this._specVersion = value;
      return this;
    } else if (hasNoArgs(value)) {
      return this._specVersion;
    } else {
      throw new Error('value argument is optional or number, but was '+typeof value);
    }
  }
  protocol(value?: string) :string | EventQuery {
    if (isStringArg(value)) {
      this._protocol = value;
      return this;
    } else if (hasNoArgs(value)) {
      return this._protocol;
    } else {
      throw new Error('value argument is optional or string, but was '+typeof value);
    }
  }
  host(value?: string) :string | EventQuery {
    if (isStringArg(value)) {
      this._host = value;
      return this;
    } else if (hasNoArgs(value)) {
      return this._host;
    } else {
      throw new Error('value argument is optional or string, but was '+typeof value);
    }
  }
  nodata(value?: number): number | EventQuery {
    if (hasNoArgs(value)) {
      return this._nodata;
    } else if (hasArgs(value)) {
      this._nodata = value;
      return this;
    } else {
      throw new Error('value argument is optional or number, but was '+typeof value);
    }
  }
  eventid(value?: string) :string | EventQuery {
    if (hasNoArgs(value)) {
      return this._eventid;
    } else if (isStringArg(value)) {
      this._eventid = value;
      return this;
    } else  {
      throw new Error('value argument is optional or string, but was '+typeof value);
    }
  }
  startTime(value?: moment) :moment | EventQuery {
    if (hasNoArgs(value)) {
      return this._startTime;
    } else if (hasArgs(value)) {
      this._startTime = checkStringOrDate(value);
      return this;
    } else {
      throw new Error('value argument is optional or moment or string, but was '+typeof value);
    }
  }
  endTime(value?: moment) :moment | EventQuery {
    if (hasNoArgs(value)) {
      return this._endTime;
    } else if (hasArgs(value)) {
      this._endTime = checkStringOrDate(value);
      return this;
    } else {
      throw new Error('value argument is optional or moment or string, but was '+typeof value);
    }
  }
  minMag(value?: number): number | EventQuery {
    if (hasNoArgs(value)) {
      return this._minMag;
    } else if (isNumArg(value)) {
      this._minMag = value;
      return this;
    } else {
      throw new Error('value argument is optional or number, but was '+typeof value);
    }
  }
  maxMag(value?: number): number | EventQuery {
    if (hasNoArgs(value)) {
      return this._maxMag;
    } else if (isNumArg(value)) {
      this._maxMag = value;
      return this;
    } else {
      throw new Error('value argument is optional or number, but was '+typeof value);
    }
  }
  minLat(value?: number): number | EventQuery {
    if (hasNoArgs(value)) {
      return this._minLat;
    } else if (isNumArg(value)) {
      this._minLat = value;
      return this;
    } else {
      throw new Error('value argument is optional or number, but was '+typeof value);
    }
  }
  maxLat(value?: number): number | EventQuery {
    if (hasNoArgs(value)) {
      return this._maxLat;
    } else if (isNumArg(value)) {
      this._maxLat = value;
      return this;
    } else {
      throw new Error('value argument is optional or number, but was '+typeof value);
    }
  }
  minLon(value?: number): number | EventQuery {
    if (hasNoArgs(value)) {
      return this._minLon;
    } else if (isNumArg(value)) {
      this._minLon = value;
      return this;
    } else {
      throw new Error('value argument is optional or number, but was '+typeof value);
    }
  }
  maxLon(value?: number): number | EventQuery {
    if (hasNoArgs(value)) {
      return this._maxLon;
    } else if (isNumArg(value)) {
      this._maxLon = value;
      return this;
    } else {
      throw new Error('value argument is optional or number, but was '+typeof value);
    }
  }
  latitude(value?: number): number | EventQuery {
    if (hasNoArgs(value)) {
      return this._latitude;
    } else if (isNumArg(value)) {
      this._latitude = value;
      return this;
    } else {
      throw new Error('value argument is optional or number, but was '+typeof value);
    }
  }
  longitude(value?: number): number | EventQuery {
    if (hasNoArgs(value)) {
      return this._longitude;
    } else if (isNumArg(value)) {
      this._longitude = value;
      return this;
    } else {
      throw new Error('value argument is optional or number, but was '+typeof value);
    }
  }
  minRadius(value?: number): number | EventQuery {
    if (hasNoArgs(value)) {
      return this._minRadius;
    } else if (isNumArg(value)) {
      this._minRadius = value;
      return this;
    } else {
      throw new Error('value argument is optional or number, but was '+typeof value);
    }
  }
  maxRadius(value?: number): number | EventQuery {
    if (hasNoArgs(value)) {
      return this._maxRadius;
    } else if (isNumArg(value)) {
      this._maxRadius = value;
      return this;
    } else {
      throw new Error('value argument is optional or number, but was '+typeof value);
    }
  }
  includearrivals(value?: boolean): boolean | EventQuery {
    if (hasNoArgs(value)) {
      return this._includearrivals;
    } else if (hasArgs(value)) {
      this._includearrivals = value;
      return this;
    } else {
      throw new Error('value argument is optional or boolean, but was '+typeof value);
    }
  }

  convertToQuake(qml: Element) :model.Quake {
    let out = new model.Quake();
    out.publicID = util._grabAttribute(qml, 'publicID');
    out.description(util._grabFirstElText(util._grabFirstEl(qml, 'description'), 'text'));
    let otimeStr = util._grabFirstElText(util._grabFirstEl(util._grabFirstEl(qml, 'origin'), 'time'),'value');
    if (otimeStr ) {
      out.time(otimeStr);
    } else {
      console.log("origintime is missing..."+out.description());
    }
    out.latitude(util._grabFirstElFloat(util._grabFirstEl(util._grabFirstEl(qml, 'origin'), 'latitude'), 'value'));
    out.longitude(util._grabFirstElFloat(util._grabFirstEl(util._grabFirstEl(qml, 'origin'), 'longitude'), 'value'));
    out.depth(util._grabFirstElFloat(util._grabFirstEl(util._grabFirstEl(qml, 'origin'), 'depth'), 'value'));
    let allOriginEls = qml.getElementsByTagNameNS(BED_NS, "origin");
    let allOrigins = [];
    for (let oNum=0; oNum < allOriginEls.length; oNum++) {
      allOrigins.push(this.convertToOrigin(allOriginEls.item(oNum)));
    }
    let allMagEls = qml.getElementsByTagNameNS(BED_NS, "magnitude");
    let allMags = [];
    for (let mNum=0; mNum < allMagEls.length; mNum++) {
      allMags.push(this.convertToMagnitude(allMagEls.item(mNum)));
    }
    if (allMags.length > 0) {out.magnitude(allMags[0]);}
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
    out.originList(allOrigins);
    out.magnitudeList(allMags);
    out.picks(allPicks);
    out.arrivals(allArrivals);
    out.eventid(this.extractEventId(qml));
    out.preferredOriginId=util._grabFirstElText(qml, 'preferredOriginID');
    out.preferredMagnitudeID=util._grabFirstElText(qml, 'preferredMagnitudeID');
    return out;
  }
  extractEventId(qml: Element) :string|null {
    let eventid = util._grabAttributeNS(qml, ANSS_CATALOG_NS, 'eventid');
    let catalogEventSource = util._grabAttributeNS(qml, ANSS_CATALOG_NS, 'eventsource');
    if (eventid) {
      if (this.host() === USGS_HOST && catalogEventSource) {
        // USGS, NCEDC and SCEDC use concat of eventsource and eventid as eventit, sigh...
        return catalogEventSource+eventid;
      } else {
        return eventid;
      }
    }
    let publicid = util._grabAttribute(qml, 'publicID');
    if (publicid) {
      let re = /eventid=([\w\d]+)/;
      let parsed = re.exec(publicid);
      if (parsed) { return parsed[1];}
      re = /evid=([\w\d]+)/;
      parsed = re.exec(publicid);
      if (parsed) { return parsed[1];}
    }
//    throw new Error("Unable to find eventid for publicID="+publicid);
    return null;
  }
  convertToOrigin(qml: Element) :model.Origin {
    let out = new model.Origin();
    let otimeStr = util._grabFirstElText(util._grabFirstEl(qml, 'time'),'value');
    if (otimeStr ) {
      out.time(otimeStr);
    } else {
      console.log("origintime is missing...");
    }
    out.latitude(util._grabFirstElFloat(util._grabFirstEl(qml, 'latitude'), 'value'));
    out.longitude(util._grabFirstElFloat(util._grabFirstEl(qml, 'longitude'), 'value'));
    out.depth(util._grabFirstElFloat(util._grabFirstEl(qml, 'depth'), 'value'));
    return out;
  }
  convertToMagnitude(qml: Element) :model.Magnitude {
    let mag = util._grabFirstElFloat(util._grabFirstElNS(qml, BED_NS, 'mag'), 'value');
    let type = util._grabFirstElText(qml, 'type');
    if (mag && type) {
      return new model.Magnitude(mag, type);
    }
    throw new Error("Did not find mag and type in Element: "+mag +" "+ type);
  }
  convertToArrival(arrivalQML: Element, allPicks: Array<model.Pick>) :model.Arrival {
    let pickID = util._grabFirstElText(arrivalQML, 'pickID');
    let phase = util._grabFirstElText(arrivalQML, 'phase');
    if (phase && pickID) {
      let myPick = allPicks.find(function(p: model.Pick) { return p.publicID() === pickID;});
      if ( ! myPick) {
        throw new Error("Can't find pick with ID="+pickID+" for Arrival");
      }
      return new model.Arrival(phase, myPick);
    } else {
      throw new Error("Arrival does not have phase or pickID: "+stringify(phase)+" "+stringify(pickID));
    }
  }
  convertToPick(pickQML: Element) :model.Pick {
    let otimeStr = util._grabFirstElText(util._grabFirstEl(pickQML, 'time'),'value');
    let time = checkStringOrDate(otimeStr);
    let waveformIDEl = util._grabFirstEl(pickQML, 'waveformID');
    let netCode = util._grabAttribute(waveformIDEl, "networkCode");
    let stationCode = util._grabAttribute(waveformIDEl, "stationCode");
    let locationCode = util._grabAttribute(waveformIDEl, "locationCode");
    let channelCode = util._grabAttribute(waveformIDEl, "channelCode");
    if (! netCode || ! stationCode || ! locationCode || ! channelCode) {
      throw new Error("missing codes: "+stringify(netCode)
                      +"."+ stringify(stationCode)
                      +"."+ stringify(locationCode)
                      +"."+ stringify(channelCode));
    }
    let out = new model.Pick(time, netCode, stationCode, locationCode, channelCode);
    out.publicID(util._grabAttribute(pickQML, "publicID"));
    return out;
  }

  query(): Promise<Array<model.Quake>> {
    let mythis = this;
    return this.queryRawXml().then(function(rawXml) {
        return mythis.parseQuakeML(rawXml);
    });
  }

  parseQuakeML(rawXml: Document) :Array<model.Quake> {
    let top = rawXml.documentElement;
    if (! top) {
      throw new Error("Can't get documentElement");
    }
    let eventArray = top.getElementsByTagName("event");
    let out = [];
    for (let i=0; i<eventArray.length; i++) {
      out[i] = this.convertToQuake(eventArray.item(i));
    }
    return out;
  }

  queryRawXml() :Promise<Document> {
    let mythis = this;
    let promise = new RSVP.Promise(function(resolve, reject) {
      let client = new XMLHttpRequest();
      let url = mythis.formURL();
      client.open("GET", url);
      client.ontimeout = function(e) {
        this.statusText = "Timeout "+this.statusText;
        reject(this);
      };
      client.onreadystatechange = handler;
      client.responseType = "text";
      client.setRequestHeader("Accept", "application/xml");
      client.send();

      function handler() {
        if (this.readyState === this.DONE) {
          console.log("handle: "+stringify(mythis.host())+" "+this.status);
          if (this.status === 200) {
            let out = new DOMParser().parseFromString(this.response, "text/xml");
            if (! out) {reject("out of DOMParser not defined");}
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
            console.log("Reject: "+stringify(mythis.host())+" "+this.status);reject(this);
          }
        }
      }
    });
    return promise;
  }


  formBaseURL() :string {
      let colon = ":";
      if (this._protocol.endsWith(colon)) {
        colon = "";
      }
      return this._protocol+colon+"//"+this._host+"/fdsnws/event/"+this._specVersion;
  }

  formCatalogsURL() :string {
    return this.formBaseURL()+"/catalogs";
  }
  queryCatalogs() :Promise<Array<string>> {
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
          console.log("handle catalogs: "+stringify(mythis.host())+" "+this.status);
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

  formContributorsURL() :string {
    return this.formBaseURL()+"/contributors";
  }
  queryContributors() :Promise<Array<string>> {
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
          console.log("handle contributors: "+stringify(mythis.host())+" "+this.status);
          if (this.status === 200) { resolve(this.response); }
          else {
            console.log("Reject contributors: "+stringify(mythis.host())+" "+this.status);reject(this); }
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

  formVersionURL() :string {
    return this.formBaseURL()+"/version";
  }

  queryVersion() :Promise<string>{
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
          console.log("handle version: "+stringify(mythis.host())+" "+this.status);
          if (this.status === 200) { resolve(this.response); }
          else {
            console.log("Reject version: "+stringify(mythis.host())+" "+this.status);reject(this); }
        }
      }
    });
    return promise;
  }

  makeParam(name: string, val: mixed) :string {
    return name+"="+encodeURIComponent(stringify(val))+"&";
  }

  formURL() :string {
    let colon = ":";
    if (this._protocol.endsWith(colon)) {
      colon = "";
    }
    let url = this.formBaseURL()+"/query?";
    if (this._eventid) { url = url+this.makeParam("eventid", this.eventid());}
    if (this._startTime) { url = url+this.makeParam("starttime", model.toIsoWoZ(this.startTime()));}
    if (this._endTime) { url = url+this.makeParam("endtime", model.toIsoWoZ(this.endTime()));}
    if (util._isDef(this._minMag)) { url = url+this.makeParam("minmag", this.minMag());}
    if (util._isDef(this._maxMag)) { url = url+this.makeParam("maxmag", this.maxMag());}
    if (util._isDef(this._minLat)) { url = url+this.makeParam("minlat", this.minLat());}
    if (util._isDef(this._maxLat)) { url = url+this.makeParam("maxlat", this.maxLat());}
    if (util._isDef(this._minLon)) { url = url+this.makeParam("minlon", this.minLon());}
    if (util._isDef(this._maxLon)) { url = url+this.makeParam("maxlon", this.maxLon());}
    if (util._isDef(this._minRadius) || util._isDef(this._maxRadius)) {
      if (util._isDef(this._latitude) && util._isDef(this._longitude)) {
        url = url+this.makeParam("latitude", this.latitude())+this.makeParam("longitude", this.longitude());
        if (util._isDef(this._minRadius)) { url = url+this.makeParam("minradius", this.minRadius());}
        if (util._isDef(this._maxRadius)) { url = url+this.makeParam("maxradius", this.maxRadius());}
      } else {
        console.log("Cannot use minRadius or maxRadius without latitude and longitude: lat="+this._latitude+" lon="+this._longitude);
        throw new Error("Cannot use minRadius or maxRadius without latitude and longitude: lat="+this._latitude+" lon="+this._longitude);
      }
    }
    if (this._includearrivals) {
      if (this._host != USGS_HOST) {
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
    if (util._isDef(this._nodata)) { url = url+this.makeParam("nodata", this.nodata());}
    if (url.endsWith('&') || url.endsWith('?')) {
      url = url.substr(0, url.length-1); // zap last & or ?
    }
    return url;
  }

}
