/**
 * @class Listing
 */
export default class {

    /**
     *
     * @param {Object} options
     * @param {Rectangle} options.rectangle
     * @param {String} [options.title]
     * @param {String} [options.image]
     */
    constructor (options) {

        this.rectangle = options.rectangle;
        this.title = options.title || "Untitled";
        this.image = options.image || `http://lorempixel.com/${this.rectangle.width}/${this.rectangle.height}`;

    }

}
