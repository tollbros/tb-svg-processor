function getCoordinatesFromRect(rect, showDots = false) {
  const x = parseFloat(rect.getAttribute('x'));
  const y = parseFloat(rect.getAttribute('y'));
  const width = parseFloat(rect.getAttribute('width'));
  const height = parseFloat(rect.getAttribute('height'));
  const transform =
    rect.transform.baseVal.numberOfItems > 0
      ? rect.transform.baseVal.consolidate().matrix
      : { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 };

  const vertices = [
    { x: x, y: y },
    { x: x + width, y: y },
    { x: x + width, y: y + height },
    { x: x, y: y + height },
  ];

  const dotsGroup = document.getElementById('DOTS');
  const coordinates = [];

  vertices.forEach((vertex) => {
    const transformedVertex = {
      x: vertex.x * transform.a + vertex.y * transform.c + transform.e,
      y: vertex.x * transform.b + vertex.y * transform.d + transform.f,
    };

    if (showDots) {
      const greenDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      greenDot.setAttribute('cx', transformedVertex.x);
      greenDot.setAttribute('cy', transformedVertex.y);
      greenDot.setAttribute('r', '3');
      greenDot.setAttribute('fill', 'green');
      dotsGroup.appendChild(greenDot);
    }

    coordinates.push({ x: transformedVertex.x, y: transformedVertex.y });
  });

  return coordinates;
}

export default getCoordinatesFromRect;
