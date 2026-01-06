const body = document.body;

const galleryElem = document.getElementById('gallery')
const genres = ['all', 'misc', 'portraits', 'nature', 'sports', 'cars']

function shuffle(array) {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

const blurElem = document.getElementById('blur')
const popupElem = document.getElementById('popup')
function openPhoto(photo) {
    popupElem.src = photo.asset;
    popupElem.style.display = 'block';
    blurElem.style.display = 'flex';

    popupElem.style.opacity = 1;
    blurElem.style.opacity = 1;
}
blurElem.addEventListener('click', () => {
    popupElem.style.opacity = 0;
    blurElem.style.opacity = 0;

    setTimeout(() => {
        popupElem.style.display = 'none';
        blurElem.style.display = 'none';
    }, 200)
})

function refreshPhotos(genre) {
    galleryElem.innerHTML = '';

    let shuffledPhotos = [];
    if (genre !== 'all') {
        shuffledPhotos = shuffle(
            gallery.filter(a => a && a.type === genre)
        );
    } else {
        shuffledPhotos = shuffle(gallery);
    }

    const BATCH_SIZE = 20;
    let currentIndex = 0;

    const oldSentinel = document.getElementById('scroll-sentinel');
    if (oldSentinel) oldSentinel.remove();

    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.style.height = '1px';
    galleryElem.after(sentinel);

    function loadNextBatch() {
        const slice = shuffledPhotos.slice(
            currentIndex,
            currentIndex + BATCH_SIZE
        );
        currentIndex += BATCH_SIZE;

        slice.forEach(photo => {
            if (!photo) return;

            const newElem = document.createElement('div');
            newElem.className = 'card';
            newElem.innerHTML = `
                <img src="${photo.asset}" loading="lazy">
                <div class="info">
                    <div class="infoDate">${photo.date}</div>
                    <div class="infoLocation">${photo.location}</div>
                </div>
            `;

            newElem.addEventListener('click', () => {
                openPhoto(photo);
            });

            newElem.addEventListener('mouseover', () => {
                if (mobile) return;
                newElem.querySelector('.info').style.display = 'block';
            });

            newElem.addEventListener('mouseleave', () => {
                if (mobile) return;
                newElem.querySelector('.info').style.display = 'none';
            });

            galleryElem.appendChild(newElem);
        });

        if (currentIndex >= shuffledPhotos.length) {
            observer.disconnect();
        }
    }

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            loadNextBatch();
        }
    }, {
        rootMargin: '300px'
    });

    observer.observe(sentinel);

    loadNextBatch();
}

const instagram = document.getElementById('instagram')
instagram.addEventListener('click', () => {
    window.open('https://www.instagram.com/abisphotos1?igsh=eTE3Y2g0eWY3cDdu', '_blank')
})

const genreSelection = document.getElementById('genreSelection')
genreSelection.addEventListener('change', () => {
    refreshPhotos(genreSelection.value)
    window.location.hash = genreSelection.value;
})

window.addEventListener("hashchange", function() {
  let genreName = window.location.hash.substring(1).toLowerCase().trim();
  if(!genres.includes(genreName)) genreName = 'all';
  genreSelection.value = genreName;

  refreshPhotos(genreName)
});
if(window.location.hash) {
    let genreName = window.location.hash.substring(1).toLowerCase().trim();
    if(!genres.includes(genreName)) genreName = 'all';
    genreSelection.value = genreName;

    refreshPhotos(genreName)
} else { refreshPhotos('all') }

let mobile = false;
if (screen.width <= 550) {
    mobile = true;
    body.setAttribute('mobile', '')
}