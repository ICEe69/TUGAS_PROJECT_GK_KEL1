const h = document.querySelector('#h');
const b = document.body;

let isRotating = false;
let startX, startY;
let currentRotationX = 75; // Initial rotation X
let currentRotationZ = 75; // Initial rotation Z
let zoomLevel = -9; // Initial zoom level
let moveX = 0; // Initial position X
let moveY = 0; // Initial position Y

const mouseSensitivity = 0.15; // Balanced mouse sensitivity
const zoomSensitivity = 0.008; // Balanced zoom sensitivity
const movementStep = 0.75; // Balanced movement step

const startRotation = (e) => {
    isRotating = true;
    startX = e.pageX;
    startY = e.pageY;
}

const rotate = (e) => {
    if (isRotating) {
        var deltaX = e.pageX - startX;
        var deltaY = e.pageY - startY;
        var rotationZ = -deltaX * mouseSensitivity;
        var rotationX = deltaY * mouseSensitivity;
        
        currentRotationZ += rotationZ;
        currentRotationX += rotationX;
        
        updateTransform();
        
        startX = e.pageX;
        startY = e.pageY;
    }
}

const stopRotation = () => {
    isRotating = false;
}

const updateTransform = () => {
    h.style.transform = `
        perspective(90vw)
        rotateX(${currentRotationX}deg)
        rotateZ(${currentRotationZ}deg)
        translateZ(${zoomLevel}vw)
        translateX(${moveX}vw)
        translateY(${moveY}vw)
    `;
}

const handleZoom = (e) => {
    e.preventDefault();
    zoomLevel += e.deltaY * -zoomSensitivity; // Adjusted zoom sensitivity
    updateTransform();
}

const handleKeyDown = (e) => {
    const radX = currentRotationX * (Math.PI / 180); // Convert X rotation degrees to radians
    const radZ = currentRotationZ * (Math.PI / 180); // Convert Z rotation degrees to radians
    let deltaX = 0;
    let deltaY = 0;
    let deltaZ = 0;

    // Prevent default behavior for these keys
    if (['a', 'd', 'w', 's'].includes(e.key)) {
        e.preventDefault();
    }

    switch(e.key) {
        case 'a': // Left
            deltaX = -movementStep;
            break;
        case 'd': // Right
            deltaX = movementStep;
            break;
        case 'w': // Forward
            deltaY = -movementStep;
            break;
        case 's': // Backward
            deltaY = movementStep;
            break;
    }
    
    // Calculate movement based on X and Z rotation
    const sinX = Math.sin(radX);
    const cosX = Math.cos(radX);
    const sinZ = Math.sin(radZ);
    const cosZ = Math.cos(radZ);

    moveX += deltaX * cosZ - deltaY * sinZ;
    moveY += deltaX * sinZ + deltaY * cosZ;

    console.log(`Key pressed: ${e.key}, moveX: ${moveX}, moveY: ${moveY}`);
    
    updateTransform();
}

// Ensure the body is focused to capture keyboard events
b.tabIndex = 0;
b.focus();

b.addEventListener('mousedown', startRotation);
b.addEventListener('mousemove', rotate);
b.addEventListener('mouseup', stopRotation);
b.addEventListener('wheel', handleZoom);
b.addEventListener('keydown', handleKeyDown);
