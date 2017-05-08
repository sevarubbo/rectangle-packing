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
        return this.getURLParam("source") === "random";
    }


    /**
     * @return {Listing[]}
     */
    get generatedListings () {

        return Array.apply(null, new Array(40)).map(() => {

            const
                width = 32 * Math.ceil(Math.random() * 8),
                height = 32 * Math.ceil(Math.random() * 8);

            return new Listing({
                title: `Listing ${width}x${height}`,
                rectangle: new Rectangle(width, height),
                image: `http://lorempixel.com/${width}/${height}`
            });

        });

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
     * Hooks
     */

    /**
     * A hooks that's triggered when DOM is ready
     */
    onDOMReady () {

        // Draw a container first
        this.drawContainer(this.container);

        // Wait for listings to resolve
        this.listingsPromise.then(listings => {

            const
                arrangedListings = this.arrangeListings(listings),
                unfitListings = listings.filter(listing => !arrangedListings.includes(listing));

            // Draw arranged listings
            this.renderListings(arrangedListings);

            // Draw listings that did not fit
            this.renderUnfitListings(unfitListings);

        });

    }



    /**
     * Methods
     */

    /**
     *
     * @param {Container} container
     */
    drawContainer (container) {

        const $container = (new ContainerView(container)).render();

        $("body").prepend($container);

        this.$container = $container;

    }


    /**
     *
     * @param {Listing[]} listings
     */
    arrangeListings (listings) {

        const
            listingRectangles = listings.map(listing => listing.rectangle),
            arrangedRectangles = this.container.arrangeRectangles(listingRectangles);

        return listings.filter(listing => arrangedRectangles.includes(listing.rectangle));

    }


    /**
     *
     * @param {Listing[]} listings
     */
    renderListings (listings) {

        const
            $listings = listings.map(listing => {
                return (new ListingView(listing)).render();
            });

        this.$container.html($listings);

    }


    /**
     *
     * @param {Listing[]} listings
     */
    renderUnfitListings (listings) {

        const
            $listings = listings.map(listing => {
                return (new ListingView(listing)).render();
            });

        $(".b-unfit-listings").append($listings);

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
