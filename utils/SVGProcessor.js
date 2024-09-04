


const SVGProcessor = function() {
    console.log("here i am please");
    const theSVG = document.querySelector('svg');
    const theLotCollections = document.getElementById('LOTS').children;
    const NumberCollection = document.getElementById('LOT_NUMBERS').children;
    const sqftCollection = document.getElementById('SQUARE_FEET');
    const lotDimensions = document.getElementById('LOT_DIMS');


    for (let i = 0; i < theLotCollections.length; i++) {
        const theLots = document.getElementById(theLotCollections[i].id).children;
        const collectionJDE = theLotCollections[i].id.replace(/LOTS-/, '');
    
        //console.log('here');
    
        for (let l = 0; l < theLots.length; l++) {
          const currentLot = theLots[l];
          //console.log(currentLot);
        }
    }



    return true;
}


export default SVGProcessor;