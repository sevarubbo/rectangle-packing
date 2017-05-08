/**
 * @class Container
 */
export default class {

    /**
     *
     * @param {Number} width
     * @param {Number} height
     */
    constructor (width, height) {

        this.width = width;
        this.height = height;

        this.packedRectangles = [];
        this.gaps = new Array(this.width).fill(0);
        this.cursorX = 0;
    }


    /**
     * Fits rectangle using the Burke algorithm
     *
     * @param {Rectangle[]} rectangles
     * @return {Rectangle[]}
     */
    arrangeRectangles (rectangles) {

        const unpackedRectangles = rectangles.slice();

        unpackedRectangles.sort((r1, r2) => {
            return r1.height - r2.height || r2.width - r1.width;
        });

        while (unpackedRectangles.length) {

            // Find the lowest gap
            let gap = this.findLowestGap();

            // Move to the gap
            this.cursorX = gap.posX;

            // Find the best fitting for pack rectangle
            let rectangleToFit = this.findBestFittingRectangle(unpackedRectangles, gap.width);

            if (rectangleToFit) {

                // Remove rectangle from unpackedRectangles
                unpackedRectangles.splice(unpackedRectangles.indexOf(rectangleToFit), 1);

                // Check if container's height is not exceeded
                if (rectangleToFit.height + this.gaps[this.cursorX] <= this.height) {
                    this.placeRectangle(rectangleToFit);
                }

            } else {

                this.raiseGapsToLowestGapNeighbour(gap);

            }

        }

        return this.packedRectangles;

    }


    /**
     * Places a rectangle into the gap
     *
     * @param {Rectangle} rectangle
     */
    placeRectangle (rectangle) {

        rectangle.left = this.cursorX;
        rectangle.top = this.gaps[this.cursorX];

        // Raise elements of array to appropriate height
        for (let i = this.cursorX; i < this.cursorX + rectangle.width; i++) {
            this.gaps[i] += rectangle.height;
        }

        this.packedRectangles.push(rectangle);

    }


    /**
     * Finds a lowest gap
     *
     * @return {{posX: number, width: number}}
     */
    findLowestGap() {

        let
            height = this.gaps[0],
            cursorX = 0,
            width = 1,
            i;

        for (i = 0; i < this.gaps.length; i++) {
            if (this.gaps[i] < height) {
                height = this.gaps[i];
                cursorX = i;
            }
        }

        i = cursorX + 1;

        // Finding the gap width
        while (i < this.gaps.length && this.gaps[i] === this.gaps[i - 1]) {
            width += 1;
            i += 1;
        }

        return {
            posX: cursorX,
            width: width
        };

    }


    /**
     *
     * Finds a best fitting rectangle - with rectangle.width / gapWidth ratio close to 1
     *
     * @param {Rectangle[]} unpackedRectangles
     * @param {Number} gapWidth
     * @return {Rectangle|null}
     */
    findBestFittingRectangle (unpackedRectangles, gapWidth) {

        let rectangleToFit = null,
            maxFitIndex = 0;

        unpackedRectangles.forEach(rectangle => {

            const fitIndex = rectangle.width / gapWidth;

            if (fitIndex <= 1 && fitIndex >= maxFitIndex) {
                maxFitIndex = fitIndex;
                rectangleToFit = rectangle;
            }

        });

        return rectangleToFit;

    }


    /**
     * Raise gap to the level of the next lowest gap
     *
     * @param {Object} gap
     */
    raiseGapsToLowestGapNeighbour (gap) {

        let lowest;

        // Raise gap to height of the lowest neighbour
        if (this.cursorX === 0) {
            lowest = this.gaps[gap.width];
        } else if (this.cursorX + gap.width === this.gaps.length) {
            lowest = this.gaps[this.cursorX - 1];
        } else if (this.gaps[this.cursorX - 1] <= this.gaps[this.cursorX + gap.width]) {
            lowest = this.gaps[this.cursorX - 1];
        } else {
            lowest = this.gaps[this.cursorX + gap.width];
        }

        for (let i = this.cursorX; i < this.cursorX + gap.width; i++) {
            this.gaps[i] = lowest;
        }

    }

}
