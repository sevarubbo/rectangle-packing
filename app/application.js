/**
 *
 */

import Container from "/models/container";
import Listing from "/models/listing";
import Rectangle from "/models/rectangle";
import ListingView from "/views/listing";
import ContainerView from "/views/container";

/**
 * @class Application
 */
export default class {

    /**
     *
     */
    constructor () {
        this.container = new Container(800, 800);
    }


    /**
     * Properties
     */

    /**
     *
     * @return {Boolean}
     */
    get shouldRandomGenerate () {
        return this.getURLParam("random") !== null;
    }


    /**
     * A hooks that's triggered when DOM is ready
     */
    onDOMReady () {

        // Draw a container first
        this.drawContainer(this.container);

        // Wait for listings to resolve
        this.listingsPromise.then(listings => {

            // Rearrange listings' rectangles
            const
                listingRectangles = listings.map(listing => listing.rectangle),
                arrangedRectangles = this.container.arrangeRectangles(listingRectangles),
                arrangedListings = listings.filter(listing => arrangedRectangles.includes(listing.rectangle));

            // Draw listings
            this.drawListings(arrangedListings);

        });

    }


    /**
     *
     * @param {Container} container
     */
    drawContainer (container) {

        const $container = (new ContainerView(container)).render();

        $("body").append($container);

        this.$container = $container;

    }


    /**
     *
     * @return {Promise.<Listing[]>}
     */
    get listingsPromise () {
        return new Promise((resolve, reject) => {

            if (this.shouldRandomGenerate) {

                resolve(this.generatedListings);

            } else {

                $.get("./data/listings.json").then(
                    data => {

                        const
                            listings = data.map(listing => new Listing({
                                rectangle : new Rectangle(listing.width, listing.height),
                                title     : listing.title,
                                image     : listing.image,
                            }));

                        resolve(listings);

                    },
                    reject
                );

            }

        });
    }


    /**
     *
     */
    get generatedListings () {

        return new Array(50).fill(1).map(() => new Listing({
            rectangle : new Rectangle(
                32 * Math.ceil(Math.random() * 8),
                32 * Math.ceil(Math.random() * 8)
            )
        }));

    }


    /**
     *
     * @param {Listing[]} listings
     */
    drawListings (listings) {

        const
            $listings = listings.map(listing => {
                return (new ListingView(listing)).render();
            });

        this.$container.html($listings);
    }


    /**
     *
     * @param name
     * @return {String}
     */
    getURLParam (name) {
        const url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        const
            regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return "";
        }
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

}
