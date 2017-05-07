/**
 * @class ListingView
 */
export default class {

    /**
     *
     * @param {Listing} listing
     */
    constructor (listing) {

        this.listing = listing;

        this.$el = $(`<article class="b-listing ${this.sizeModifier}"></article>`);

    }


    /**
     *
     * @return {String}
     */
    get sizeModifier () {

        const width = this.listing.rectangle.width;

        let size = "medium";

        if (width <= 32) {
            size = "x-small";
        } else if (width <= 64) {
            size = "small";
        } else if (width >= 256) {
            size = "large";
        }

        return `m-size_${size}`;
    }


    /**
     *
     * @return {jQuery}
     */
    render () {

        this.$el.html(`<h1 class="b-listing__title">${this.listing.title}</h1>`);

        this.$el.css({
            top: this.listing.rectangle.top,
            left: this.listing.rectangle.left,
            width: this.listing.rectangle.width,
            height: this.listing.rectangle.height,
            backgroundImage: `url("${this.listing.image}")`
        });

        return this.$el;

    }

}
