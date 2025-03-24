function createPath2DFromElement(element) {
  const pathData = element.getAttribute('d');
  return new Path2D(pathData);
}

function point_in_polygon(point, polygon) {
  const num_vertices = polygon?.length;
  const x = point.x;
  const y = point.y;
  let inside = false;

  if (num_vertices) {
    let p1 = polygon[0];
    let p2;

    for (let i = 1; i <= num_vertices; i++) {
      p2 = polygon[i % num_vertices];

      if (y > Math.min(p1.y, p2.y)) {
        if (y <= Math.max(p1.y, p2.y)) {
          if (x <= Math.max(p1.x, p2.x)) {
            const x_intersection = ((y - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y) + p1.x;

            if (p1.x === p2.x || x <= x_intersection) {
              inside = !inside;
            }
          }
        }
      }

      p1 = p2;
    }
  }

  return inside;
}

function checkCollision(lot, numberElement, coordinates, showDots = false) {
  // Get the bounding box of the number element
  const bbox = numberElement.getBBox();

  // Calculate the center point in local coordinates
  let centerX = bbox.x + bbox.width / 2;
  let centerY = bbox.y + bbox.height / 2;

  //const screenCTM = numberElement.getScreenCTM(); //This is wrong from some reason!?
  const screenCTM =
    numberElement.transform.baseVal.numberOfItems > 0
      ? numberElement.transform.baseVal.consolidate().matrix
      : { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 };

  // Transform the center point using the screen CTM
  const transformedCenter = {
    x: centerX * screenCTM.a + centerY * screenCTM.c + screenCTM.e,
    y: centerX * screenCTM.b + centerY * screenCTM.d + screenCTM.f,
  };

  if (showDots) {
    // Create a blue dot at the center point
    const blueDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    blueDot.setAttribute('cx', transformedCenter.x);
    blueDot.setAttribute('cy', transformedCenter.y);
    blueDot.setAttribute('r', '3');
    blueDot.setAttribute('fill', 'blue');
    //blueDot.classList.add('ignore-dot');

    // Append the blue dot to the DOTS group
    const dotsGroup = document.getElementById('DOTS');
    dotsGroup.appendChild(blueDot);
  }

  let checked = false;

  if (lot.tagName == 'path') {
    const path1 = createPath2DFromElement(lot);
    const ctx = document.createElement('canvas').getContext('2d');
    checked = ctx.isPointInPath(path1, transformedCenter.x, transformedCenter.y);
  } else {
    checked = point_in_polygon({ x: transformedCenter.x ? transformedCenter.x : centerX, y: transformedCenter.y ? transformedCenter.y : centerY }, coordinates);
  }

  return checked;
}

export default checkCollision;
