
import getCoordinatesFromPolygon from './getCoordinatesFromPolygon';
import getCoordinatesFromRect from './getCoordinatesFromRect';
import checkCollision from './checkCollision';



const getYoungestGroup = (element) => {
  let newElement = element;

  if (newElement.tagName == 'g') {
    while (newElement.tagName == 'g' && newElement.children.length > 0) {
      newElement = newElement.children[0];
    }
  }
  return newElement;
}

const svg_lot_processor = function(isDesert, lot, jde_num, NumberCollection, sqftCollection, lotDimensions) {
  console.log("svg_lot_processor...");
  //const NumberCollection = document.getElementById('LOT_NUMBERS').children;
  //const sqftCollection = document.getElementById('SQUARE_FEET');
  //const lotDimensions = document.getElementById('LOT_DIMS') || document.getElementById('LOT_DIMENSIONS');

  const collectionJDE = jde_num;
  const currentLot = lot;
  let coordinates;
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
  }

  for (let g = 0; g < NumberCollection.length; g++) {

    const numberChildren = NumberCollection[g].querySelectorAll(':scope > *:not([data-jde_num])');
    numberChildren.forEach((numberThing) => {
      let numberElement = numberThing;
      numberElement = getYoungestGroup(numberElement);    
      const lotDigits = numberElement.textContent.trim();
      const collided = checkCollision(currentLot, numberElement, coordinates);

      if (collided) {
        currentLot.setAttribute('data-jde_num', collectionJDE);
        currentLot.setAttribute('data-lot_num', parseInt(lotDigits));
        numberThing.setAttribute('data-jde_num', collectionJDE);
        numberThing.setAttribute('data-lot_num', parseInt(lotDigits));


        if (sqftCollection) {
          // Select all elements inside sqftCollection that do NOT have 'data-jde_num'
          const sqftChildren = sqftCollection.querySelectorAll(':scope > *:not([data-jde_num])');
      
          sqftChildren.forEach((sqftChild) => {
              // Select all children within this element that do NOT have 'data-jde_num'
              const collectionSQFTChildren = sqftChild.querySelectorAll(':scope > *:not([data-jde_num])');
      
              collectionSQFTChildren.forEach((currentSQFT) => {
                  // Ensure we're checking the correct element
                  const parentSQFT = currentSQFT;
                  currentSQFT = getYoungestGroup(parentSQFT);
      
                  const sqft_collided = checkCollision(currentLot, currentSQFT, coordinates);
      
                  if (sqft_collided) {
                    parentSQFT.setAttribute('data-jde_num', collectionJDE);
                    parentSQFT.setAttribute('data-lot_num', parseInt(lotDigits));
                  }
              });
          });
        }
      

        if (lotDimensions) {
          // Select all children that do NOT have the 'data-jde_num' attribute
          const lotDimChildren = lotDimensions.children[0].querySelectorAll(':scope > *:not([data-jde_num])');
      
          lotDimChildren.forEach((lotDim) => {
            const parentLotDim = lotDim;
              /* let currentDIM = lotDim;
      
              // If it's a group (`<g>`), use its first child
              if (currentDIM.tagName === 'g' && currentDIM.children.length > 0) {
                  currentDIM = currentDIM.children[0];
              } */

              const currentDIM = getYoungestGroup(parentLotDim);
      
              console.log(currentDIM);
              const dim_collided = checkCollision(currentLot, currentDIM, coordinates);
      
              if (dim_collided) {
                console.log('DIM COLLIDED');
                parentLotDim.setAttribute('data-jde_num', collectionJDE);
                parentLotDim.setAttribute('data-lot_num', parseInt(lotDigits));
              }
          });
      }

        //break;
      } else {
        //console.log(`Lot ${currentLot.id}: Number ${lotDigits} is NOT inside the lot.`);
      }

    });

  }

  return true;
}


export default svg_lot_processor;