
import getCoordinatesFromPolygon from './getCoordinatesFromPolygon';
import getCoordinatesFromRect from './getCoordinatesFromRect';
import checkCollision from './checkCollision';



const getParcel = function(lot, parcels) {
    let theParcel = null;
    const theParcels = parcels.children;

    for (let g = 0; g < theParcels.length; g++) {
        let parcel_coordinates;
        if (theParcels[g].tagName === 'polygon') {
            parcel_coordinates = getCoordinatesFromPolygon(theParcels[g]);
        } else if (theParcels[g].tagName === 'rect') {
            parcel_coordinates = getCoordinatesFromRect(theParcels[g]);
        } else if (theParcels[g].tagName === 'path') {
            parcel_coordinates = 'none';
        } else if (theParcels[g].tagName === 'polyline') {
            parcel_coordinates = getCoordinatesFromPolygon(theParcels[g]);
        } else {
            console.error('NO KNOWN SHAPE for PARCEL?');
            console.log(theParcels[g]);
        } 

        const collided = checkCollision(theParcels[g], lot, parcel_coordinates);

        if (collided) {
            return theParcels[g];
        }
    }   
 
  return theParcel;
}


export default getParcel;