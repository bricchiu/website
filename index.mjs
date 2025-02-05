import "./styles.css";

import {
  Rive,
  Fit,
  Alignment,
  Layout,
  decodeImage,
} from "@rive-app/canvas";


// ----
// Out of band images example
// ----

const layout = new Layout({
  fit: Fit.Cover,
  alignment: Alignment.Center,
});

const riveCanvas = document.getElementById("riveCanvas");



// Load a demo reel image by using the decodeImage API to feed to a
// setRenderImage API on the asset provided in assetLoader
const loadDemoReelImage = (asset, imageIndex) => {
  const imagePath = `/assets/images/demo-reel-thumbnail/Reel gif_${imageIndex.toString().padStart(5, "0")}.png`;
  fetch(imagePath)
    .then(async (res) => {
      if (res.ok) {
        const image = await decodeImage(new Uint8Array(await res.arrayBuffer()));
        asset.setRenderImage(image);
        // You could maintain a reference and update the image dynamically at any time.
        // But be sure to call unref to release any references when no longer needed.
        image.unref();
      } else {
        console.error("Image load failed for index:", imageIndex);
      }
    })
    .catch((err) => console.error("Error loading image:", err));
};

const riveInstance = new Rive({
  src: "layouts.riv",
  stateMachines: "site", // Name of the State Machine to play
  canvas: riveCanvas,
  layout: layout, // This is optional. Provides additional layout control.
  autoplay: true,
  // Callback handler to pass in that dictates what to do with an asset found in
  // the Rive file that's being loaded in
  assetLoader: (asset, bytes) => {
    console.log("Tell our asset importer if we are going to load the asset contents", {
      name: asset.name,
      fileExtension: asset.fileExtension,
      cdnUuid: asset.cdnUuid,
      isFont: asset.isFont,
      isImage: asset.isImage,
      bytes,
    });

    // Here, we load a specific image from the demo reel folder
    if (asset.isImage) {
        const imageIndex = 0; // Change this to select a specific image index (0 to 173)
        loadDemoReelImage(asset, imageIndex);
        return true;
    } else {
      return false;
    }
  },
  onLoad: () => {
    // Prevent a blurry canvas by using the device pixel ratio
    riveInstance.resizeDrawingSurfaceToCanvas();
  }
});

// Resize the drawing surface if the window resizes
window.addEventListener(
  "resize",
  () => {
    riveInstance.resizeDrawingSurfaceToCanvas();
  },
  false
);
