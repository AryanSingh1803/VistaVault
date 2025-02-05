        const accessKey = 'rSjxajXJ0vm0PoEVXF4fqCuxbMvByGLEt3AVWv8vIMM';
        const gallery = document.getElementById('gallery');
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const spinner = document.getElementById('spinner');

        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.close');
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        const slideshowToggle = document.getElementById('slideshow-toggle');

        let images = [];
        let currentIndex = 0;
        let slideshowInterval = null;

        async function fetchImages(query) {
            spinner.style.display = 'block';
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}&per_page=15`);
            const data = await response.json();
            spinner.style.display = 'none';
            return data.results.map(img => img.urls.small);
        }

        function displayImages(imageUrls) {
            gallery.innerHTML = '';
            images = imageUrls;
            images.forEach((src, index) => {
                const img = document.createElement('img');
                img.src = src;
                img.classList.add('gallery-item');
                img.addEventListener('click', () => openLightbox(index));
                gallery.appendChild(img);
            });
        }

        searchBtn.addEventListener('click', async () => {
            const query = searchInput.value.trim();
            if (query) {
                const imageUrls = await fetchImages(query);
                displayImages(imageUrls);
            }
        });

        function openLightbox(index) {
            currentIndex = index;
            lightboxImg.src = images[currentIndex];
            lightbox.style.display = 'flex';
        }

        function closeLightbox() {
            lightbox.style.display = 'none';
            stopSlideshow();
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % images.length;
            lightboxImg.src = images[currentIndex];
        }

        function prevImage() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentIndex];
        }

        function toggleSlideshow() {
            if (slideshowInterval) {
                stopSlideshow();
            } else {
                startSlideshow();
            }
        }

        function startSlideshow() {
            slideshowInterval = setInterval(nextImage, 2000);
            slideshowToggle.textContent = '⏸️ Pause';
        }

        function stopSlideshow() {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
            slideshowToggle.textContent = '▶️ Slideshow';
        }

        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', nextImage);
        prevBtn.addEventListener('click', prevImage);
        slideshowToggle.addEventListener('click', toggleSlideshow);

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
                if (e.key === 'Escape') closeLightbox();
            }
        });
