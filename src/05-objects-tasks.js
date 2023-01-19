/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  const rectangle = {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };

  return rectangle;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const values = Object.values(obj);
  return new proto.constructor(...values);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

// const cssSelectorBuilder = {
//   element(/* value */) {
//     throw new Error('Not implemented');
//   },

//   id(/* value */) {
//     throw new Error('Not implemented');
//   },

//   class(/* value */) {
//     throw new Error('Not implemented');
//   },

//   attr(/* value */) {
//     throw new Error('Not implemented');
//   },

//   pseudoClass(/* value */) {
//     throw new Error('Not implemented');
//   },

//   pseudoElement(/* value */) {
//     throw new Error('Not implemented');
//   },

//   combine(/* selector1, combinator, selector2 */) {
//     throw new Error('Not implemented');
//   },
// };

class CssSelectorBuilderClass {
  constructor() {
    this.cssElement = '';
    this.cssId = '';
    this.cssClass = '';
    this.cssAttr = '';
    this.cssPseudoClass = '';
    this.cssPseudoElement = '';
    this.combinator = '';
  }

  stringify() {
    const elem = this.cssElement ? this.cssElement : '';
    const id = this.cssId ? `#${this.cssId}` : '';
    const cssClass = this.cssClass ? `${this.cssClass}` : '';
    const attr = this.cssAttr ? `[${this.cssAttr}]` : '';
    const psClass = this.cssPseudoClass ? `${this.cssPseudoClass}` : '';
    const psElement = this.cssPseudoElement ? `::${this.cssPseudoElement}` : '';

    return elem + id + cssClass + attr + psClass + psElement;
  }

  element(value) {
    if (this.cssElement === '') {
      if (['cssId', 'cssClass', 'cssAttr', 'cssPseudoClass', 'cssPseudoElement'].some((e) => this[e])) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }

      const obj = Object.create(this);
      Object.assign(obj, this);
      obj.cssElement = value;
      return obj;
    }

    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }

  id(value) {
    if (this.cssId === '') {
      if (['cssClass', 'cssAttr', 'cssPseudoClass', 'cssPseudoElement'].some((e) => this[e])) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }

      const obj = Object.create(this);
      Object.assign(obj, this);
      obj.cssId = value;
      return obj;
    }

    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }

  class(value) {
    if (['cssAttr', 'cssPseudoClass', 'cssPseudoElement'].some((e) => this[e])) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    const obj = Object.create(this);
    Object.assign(obj, this);
    obj.cssClass += `.${value}`;
    return obj;
  }

  attr(value) {
    if (['cssPseudoClass', 'cssPseudoElement'].some((e) => this[e])) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    const obj = Object.create(this);
    Object.assign(obj, this);
    obj.cssAttr = value;
    return obj;
  }

  pseudoClass(value) {
    if (['cssPseudoElement'].some((e) => this[e])) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    const obj = Object.create(this);
    Object.assign(obj, this);
    obj.cssPseudoClass += `:${value}`;
    return obj;
  }

  pseudoElement(value) {
    if (this.cssPseudoElement === '') {
      const obj = Object.create(this);
      Object.assign(obj, this);
      obj.cssPseudoElement = value;
      return obj;
    }

    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }

  combine(selector1, combinator, selector2) {
    const obj = Object.create(this);
    obj.selector1 = selector1.stringify();
    obj.selector2 = selector2.stringify();
    obj.combinator = combinator;
    obj.stringify = () => `${obj.selector1} ${obj.combinator} ${obj.selector2}`;
    return obj;
  }
}
const cssSelectorBuilder = new CssSelectorBuilderClass();

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
