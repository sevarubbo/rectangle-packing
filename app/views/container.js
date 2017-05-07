/**
 * @class ListingView
 */
export default class {

    /**
     *
     * @param {Container} container
     */
    constructor (container) {

        this.container = container;

        this.$el = $(`<section class="b-container"></section>`);

    }


    /**
     *
     * @return {jQuery}
     */
    render () {

        this.$el.css({
            width: this.container.width,
            height: this.container.height
        });

        return this.$el;

    }

}
