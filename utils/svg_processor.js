
import getCoordinatesFromPolygon from './getCoordinatesFromPolygon';
import getCoordinatesFromRect from './getCoordinatesFromRect';
import checkCollision from './checkCollision';

const svg_processor = async function() {

    console.log("starting SVG Processor");
    const theSVG = document.querySelector('svg');
    const theLotCollections = document.getElementById('LOTS').children;
    const NumberCollection = document.getElementById('LOT_NUMBERS').children;
    const sqftCollection = document.getElementById('SQUARE_FEET');
    const lotDimensions = document.getElementById('LOT_DIMS');


    for (let i = 0; i < theLotCollections.length; i++) {
        const theLots = document.getElementById(theLotCollections[i].id).children;
        const collectionJDE = theLotCollections[i].id.replace(/LOTS-/, '');
    
        let coordinates;

        for (let l = 0; l < theLots.length; l++) {
          const currentLot = theLots[l];
          if (currentLot.tagName === 'polygon') {
            coordinates = getCoordinatesFromPolygon(currentLot);
          } else if (currentLot.tagName === 'rect') {
            coordinates = getCoordinatesFromRect(currentLot);
          } else if (currentLot.tagName === 'path') {
            coordinates = 'none';
          } else if (currentLot.tagName === 'polyline') {
            console.log('POLYLINE');
            coordinates = getCoordinatesFromPolygon(currentLot);
          } else {
            console.error('NO KNOWN SHAPE?');
            console.log(currentLot);
            continue;
          }

          for (let g = 0; g < NumberCollection.length; g++) {
            const numberGroup = Array.from(NumberCollection[g].children).filter(
              (child) => child.getAttribute('data-parsed') !== 'true'
            );

    
            for (let m = 0; m < numberGroup.length; m++) {
              let numberElement = numberGroup[m];
    
              if (numberElement.tagName == 'g') {

                if (numberElement.children[0].tagName == 'g') {
                  console.log("numberElement group in a group fix attempt");
                  numberElement = numberElement.children[0].children[0];
                } else {
                  numberElement = numberElement.children[0];
                }
              
              }
  
    
              const lotDigits = numberElement.textContent.trim();

              const collided = checkCollision(currentLot, numberElement, coordinates);
    
              if (collided) {
                currentLot.setAttribute('data-jde_num', collectionJDE);
                currentLot.setAttribute('data-lot_num', parseInt(lotDigits));
                numberGroup[m].setAttribute('data-jde_num', collectionJDE);
                numberGroup[m].setAttribute('data-lot_num', parseInt(lotDigits));
                numberGroup[m].setAttribute('data-parsed', true);


                if (sqftCollection) {
                  const sqftChildren = document.getElementById('SQUARE_FEET').children;

                  for (let s = 0; s < sqftChildren.length; s++) {
                    const collectionSQFTChildren = sqftChildren[s].children;

                    for (let ft = 0; ft < collectionSQFTChildren.length; ft++) {
                      let currentSQFT = collectionSQFTChildren[ft];

                      if (currentSQFT.tagName == 'g') {
                        currentSQFT = currentSQFT.children[0];
                      }

                      const sqft_collided = checkCollision(currentLot, currentSQFT, coordinates);

                      if (sqft_collided) {
                        collectionSQFTChildren[ft].setAttribute('data-jde_num', collectionJDE);
                        collectionSQFTChildren[ft].setAttribute('data-lot_num', parseInt(lotDigits));
                        break;
                      }
                    }
                  }
                }

                if (lotDimensions) {
                  const lotDimChildren = document.getElementById('LOT_DIMS').children;

                  for (let i = 0; i < lotDimChildren.length; i++) {
                    const lotDim = lotDimChildren[i].children;

                    for (let c = 0; c < lotDim.length; c++) {
                      let currentDIM = lotDim[c];

                      if (currentDIM.tagName == 'g') {
                        currentDIM = lotDim[c].children[0];
                      }

                      const dim_collided = checkCollision(currentLot, currentDIM, coordinates);

                      if (dim_collided) {
                        lotDim[c].setAttribute('data-jde_num', collectionJDE);
                        lotDim[c].setAttribute('data-lot_num', parseInt(lotDigits));
                      }
                    }
                  }
                }

                break;
              } else {
                //console.log(`Lot ${currentLot.id}: Number ${lotDigits} is NOT inside the lot.`);
              }

            }

          }
        }

    }


    console.log("SVG Processing: Complete...");
    return true;
}


export default svg_processor;