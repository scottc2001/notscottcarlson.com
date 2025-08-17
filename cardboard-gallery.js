const galleryElement = document.getElementById('cardboard-gallery');
const lightbox = document.getElementById('cardboard-lightbox');
const lightboxImg = document.querySelector('.cardboard-lightbox-img');
const lightboxCaption = document.querySelector('.cardboard-lightbox-caption');
const closeBtn = document.querySelector('.cardboard-close-btn');
const prevBtn = document.querySelector('.cardboard-nav-prev');
const nextBtn = document.querySelector('.cardboard-nav-next');

let images = [];
let currentIndex = 0;

// Load images from JSON
fetch('2020-03-16_Cardboard-Packaging.json')
  .then(response => response.json())
  .then(data => {
    images = data;
    buildGallery();
  })
  .catch(err => console.error('Error loading JSON:', err));

// Build gallery with captions
function buildGallery() {
  images.forEach((imgObj, index) => {
    const container = document.createElement('div');
    container.classList.add('image-item');

    const imgEl = document.createElement('img');
    imgEl.src = `2020-03-16_Cardboard-Packaging/${imgObj.file}`;
    imgEl.alt = imgObj.file;
    imgEl.addEventListener('click', () => openLightbox(index));

    const caption = document.createElement('div');
    caption.classList.add('caption');
    caption.textContent = imgObj.file;

    container.appendChild(imgEl);
    container.appendChild(caption);
    galleryElement.appendChild(container);
  });
}

// Open lightbox
function openLightbox(index) {
  currentIndex = index;
  const imgObj = images[currentIndex];

  lightbox.style.display = 'flex';
  lightboxImg.src = `2020-03-16_Cardboard-Packaging/${imgObj.file}`;
  lightboxCaption.textContent = imgObj.file;
}

// Close lightbox
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

// Navigate lightbox
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  openLightbox(currentIndex);
});
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  openLightbox(currentIndex);
});

// Close on outside click
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.style.display = 'none';
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (lightbox.style.display === 'flex') {
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      openLightbox(currentIndex);
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      openLightbox(currentIndex);
    } else if (e.key === 'Escape') {
      lightbox.style.display = 'none';
    }
  }
});
