


// these are similar methods as in seisplotjs-fdsnstation
// duplicate here to avoid dependency and diff NS, yes that is dumb...


export function _isDef(v: mixed) :boolean {
  return typeof v !== 'undefined' && v !== null;
}


export function  _grabFirstElNS(xml: Element | null | void, namespace: string, tagName: string) :Element | void {
  let out = undefined;
  if ( _isDef(xml)) {
    let elList = xml.getElementsByTagNameNS(namespace, tagName);
    if (_isDef(elList) && elList.length > 0) {
      out = elList.item(0);
    }
  }
  return out;
}

export function  _grabFirstEl(xml: Element | null | void, tagName: string) :Element | void {
  let out = undefined;
  if ( _isDef(xml)) {
    let elList = xml.getElementsByTagName(tagName);
    if (_isDef(elList) && elList.length > 0) {
      out = elList.item(0);
    }
  }
  return out;
}

export function  _grabFirstElText(xml: Element | null | void, tagName: string) :string | void {
  let out = undefined;
  let el = _grabFirstEl(xml, tagName);
  if (_isDef(el)) {
    out = el.textContent;
  }
  return out;
}

export function  _grabFirstElFloat(xml: Element | null | void, tagName: string) :number | void {
  let out = undefined;
  let el = _grabFirstElText(xml, tagName);
  if (_isDef(el)) {
    out = parseFloat(el);
  }
  return out;
}

export function  _grabAttribute(xml: Element | null | void, tagName: string) :string | void {
  let out = undefined;
  if ( _isDef(xml)) {
    let a = xml.getAttribute(tagName);
    if (_isDef(a)) {
      out = a;
    }
  }
  return out;
}

export function  _grabAttributeNS(xml: Element | null | void, namespace: string, tagName: string) :string | void {
  let out = undefined;
  if ( _isDef(xml)) {
    let a = xml.getAttributeNS(namespace, tagName);
    if (_isDef(a)) {
      out = a;
    }
  }
  return out;
}
