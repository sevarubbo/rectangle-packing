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
    }


    /**
     *
     * @param {Rectangle[]} rectangles
     * @return {Rectangle[]}
     */
    arrangeRectangles (rectangles) {

        const
            unpackedRectangles = rectangles.slice(),
            packedRectangles = [],
			unfitRectangles = [],
            gaps = new Array(this.width).fill(0);

        let minGap,
            gapWidth,
            xOffset = 0,
            lowest,
            k = 0;

        unpackedRectangles.sort((r1, r2) => {
        	return r1.height - r2.height || r2.width - r1.width;
		});

        while (unpackedRectangles.length) {

        	let i = 0;

            if (k++ > 10000) {
				console.log(unpackedRectangles.length);
				console.error("While overload");
				return;
			}

            // Find the lowest gap
			minGap = gaps[0];

			xOffset = 0;

			for (i = 0; i < gaps.length; i++) {
				if (gaps[i] < minGap) {
					minGap = gaps[i];
					xOffset = i;
				}
			}

			i = xOffset + 1;
			gapWidth = 1;

			// Finding the gap width
			while (i < gaps.length && gaps[i] === gaps[i - 1]) {
				gapWidth += 1;
				i += 1;
			}

			// Find the best fitting for pack rectangle

			let rectangleToFit,
				maxFitIndex = 0;

			unpackedRectangles.forEach(rectangle => {

				const fitIndex = rectangle.width / gapWidth;

				if (fitIndex <= 1 && fitIndex >= maxFitIndex) {
					maxFitIndex = fitIndex;
					rectangleToFit = rectangle;
				}

			});

			if (rectangleToFit) {

				unpackedRectangles.splice(unpackedRectangles.indexOf(rectangleToFit), 1);

                // Place best fitting rectangle using placement policy "Leftmost"

				if (rectangleToFit.height + gaps[xOffset] > this.height) {
					unfitRectangles.push(rectangleToFit);
				} else {

					rectangleToFit.left = xOffset;
					rectangleToFit.top = gaps[xOffset];

					// Raise elements of array to appropriate height
					for (let j = xOffset; j < xOffset + rectangleToFit.width; j++) {
						gaps[j] += rectangleToFit.height;
					}

					packedRectangles.push(rectangleToFit);

				}

            } else {

			    // Raise gap to height of the lowest neighbour
				if (xOffset === 0) {
					lowest = gaps[gapWidth];
				} else if (xOffset + gapWidth === gaps.length) {
					lowest = gaps[gaps.length - gapWidth - 1];
				} else if (gaps[xOffset - 1] <= gaps[xOffset + gapWidth]) {
					lowest = gaps[xOffset - 1];
				} else {
					lowest = gaps[xOffset + gapWidth];
				}

				for (let j = xOffset; j < xOffset + gapWidth; j++) {
					gaps[j] = lowest;
				}

            }

        }

        return packedRectangles;

    }

}
