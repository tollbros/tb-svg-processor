function getCoordinatesFromPolygon(polygon, showDots = false) {
  const points = polygon.points;
  const dotsGroup = document.getElementById('DOTS');
  const coordinates = [];

  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    if (showDots) {
      const greenDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      greenDot.setAttribute('cx', point.x);
      greenDot.setAttribute('cy', point.y);
      greenDot.setAttribute('r', '3');
      greenDot.setAttribute('fill', 'green');
      dotsGroup.appendChild(greenDot);
    }

    coordinates.push({ x: point.x, y: point.y });
  }

  return coordinates;
}

export default getCoordinatesFromPolygon;
