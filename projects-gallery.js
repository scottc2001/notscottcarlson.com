const projectFolders = [
  "2020-03-16_Cardboard Packaging",
  "project2",
  "project3",
  "project4",
  "project5",
  "project6",
  "project7",
  "project8",
  "project9"
];

// Lightbox elements
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector(".lightbox-img");
const lightboxVideo = document.createElement("video");
lightboxVideo.controls = true;
lightboxVideo.style.display = "none";
lightbox.appendChild(lightboxVideo);
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const closeBtn = lightbox.querySelector(".close-btn");

let currentMedia = [];
let currentIndex = 0;

// Load each project's media
projectFolders.forEach((folder, idx) => {
  const galleryId = `gallery-project${idx + 1}`;
  const container = document.getElementById(galleryId);

  fetch(`projects/${folder}/project.json`)
    .then(res => res.json())
    .then(data => {
      data.forEach((item, mediaIndex) => {
        let el;
        if (item.type.toLowerCase() === "jpg" || item.type.toLowerCase() === "png") {
          el = document.createElement("img");
          el.src = `projects/${folder}/${item.file}`;
        } else if (item.type.toLowerCase() === "mov" || item.type.toLowerCase() === "mp4") {
          el = document.createElement("video");
          el.src = `projects/${folder}/${item.file}`;
          el.controls = false;
        }

        if (el) {
          el.classList.add("project-media");
          el.addEventListener("click", () => openLightbox(data, mediaIndex, folder));
          container.appendChild(el);
        }
      });
    })
    .catch(err => console.error(`Error loading ${folder}/project.json:`, err));
});

// Lightbox functions
function openLightbox(mediaArray, index, folder) {
  currentMedia = mediaArray;
  currentIndex = index;

  const item = mediaArray[index];

  if (item.type.toLowerCase() === "jpg" || item.type.toLowerCase() === "png") {
    lightboxImg.src = `projects/${folder}/${item.file}`;
    lightboxImg.style.display = "block";
    lightboxVideo.style.display = "none";
  } else {
    lightboxVideo.src = `projects/${folder}/${item.file}`;
    lightboxVideo.style.display = "block";
    lightboxImg.style.display = "none";
    lightboxVideo.play();
  }

  lightboxCaption.textContent = item.file;
  lightbox.style.display = "flex";
}

// Close lightbox
closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
  lightboxVideo.pause();
});

// Lightbox navigation (optional)
lightbox.querySelector(".nav-prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + currentMedia.length) % currentMedia.length;
  openLightbox(currentMedia, currentIndex, projectFolders.find(f => currentMedia === f));
});
lightbox.querySelector(".nav-next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % currentMedia.length;
  openLightbox(currentMedia, currentIndex, projectFolders.find(f => currentMedia === f));
});

// Close lightbox on outside click
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
    lightboxVideo.pause();
  }
});
