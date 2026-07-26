// 1. LENIS SMOOTH SCROLL
const initLenis = () => {
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
};

window.addEventListener("load", () => {
  initLenis();

  // SPLASH SCREEN SEQUENCE
  const splashTl = gsap.timeline();

  splashTl
    .to(".splash-text", {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.3,
      ease: "power3.out",
    })
    .to(
      ".splash-line",
      {
        scaleX: 1,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.8"
    )
    .to("#splash-screen", {
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        document.getElementById("splash-screen").classList.add("hidden");
      },
    });
});

// GSAP
gsap.registerPlugin(ScrollTrigger);

// 2. OPEN INVITATION
function openInvitation() {
  const music = document.getElementById("bg-music");
  const icon = document.querySelector("#music-control i");

  music.muted = false;
  music
    .play()
    .catch((e) =>
      console.log("Audio play failed (user interaction required):", e)
    );

  document.getElementById("music-control").style.opacity = "1";
  icon.classList.add("spin-slow", "fa-compact-disc");
  icon.classList.remove("fa-volume-mute");

  const tl = gsap.timeline();

  tl.to(
    "#cover-screen .relative > *",
    { y: -30, opacity: 0, duration: 0.8, stagger: 0.1 },
    0
  )
    .to("#cover-bg-img", { scale: 1.1, duration: 1.5 }, 0)
    .to("#cover-overlay", { opacity: 0, duration: 1 }, 0)
    .to(
      "#cover-screen",
      {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
        onComplete: () => {
          document
            .getElementById("main-content")
            .classList.remove("hidden");
          initScrollAnimations();
        },
      },
      0.5
    );
}

// 3. SCROLL ANIMATIONS
function initScrollAnimations() {
  gsap.to(".hero-anim", {
    y: 0,
    opacity: 1,
    duration: 1.5,
    stagger: 0.2,
    ease: "power3.out",
  });
  gsap.to(".fade-in-delay", { opacity: 1, duration: 1, delay: 2 });
  gsap.to(".parallax-bg img", {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
      trigger: ".parallax-wrapper",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
  gsap.utils.toArray(".reveal-up").forEach((elem) => {
    gsap.fromTo(
      elem,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: elem, start: "top 85%" },
      }
    );
  });

  // Event Cards Stagger
  gsap.utils.toArray(".event-card-3d").forEach((card, i) => {
    gsap.from(card, {
      rotationX: 45,
      y: 50,
      opacity: 0,
      duration: 1,
      delay: i * 0.2,
      ease: "back.out(1.5)",
      scrollTrigger: { trigger: card, start: "top 90%" },
    });
  });

  // Parallax banners
  gsap.utils.toArray(".parallax-banner-img").forEach((img) => {
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: "none",
      scrollTrigger: {
        trigger: img.closest(".parallax-banner-section"),
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
  gsap.utils.toArray(".parallax-banner-text").forEach((text) => {
    gsap.fromTo(text, { opacity: 0, y: 25 }, {
      opacity: 1, y: 0, duration: 1, ease: "power2.out",
      scrollTrigger: {
        trigger: text.closest(".parallax-banner-section"),
        start: "top 75%",
      },
    });
  });

  // Gallery reveal
  gsap.fromTo("#photo-gallery", { opacity: 0, y: 30 }, {
    opacity: 1, y: 0, duration: 1, ease: "power2.out",
    scrollTrigger: { trigger: "#polaroid-section", start: "top 80%" },
  });
}

// 4. UTILS — Guest Name from URL
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get("to");
  if (guestName) {
    document.getElementById("guest-name").innerText =
      decodeURIComponent(guestName);
    const cgn = document.getElementById("closing-guest-name");
    const cgw = document.getElementById("closing-guest-wrapper");
    if (cgn && cgw) {
      cgn.innerText = decodeURIComponent(guestName);
      cgw.style.display = "block";
    }
  }
});

// Music Control
let isMusicPlaying = true;

function toggleMusic() {
  const music = document.getElementById("bg-music");
  const icon = document.querySelector("#music-control i");

  music.play();
  icon.classList.add("spin-slow", "fa-compact-disc");
  icon.classList.remove("fa-volume-mute");
  isMusicPlaying = true;
}

document.addEventListener("DOMContentLoaded", function () {
  toggleMusic();
});

// 5. LIGHTBOX
const galleryPhotos = [
  'assets/images/IMG_8254.JPG', 'assets/images/IMG_8256.JPG',
  'assets/images/IMG_8257.JPG', 'assets/images/IMG_8259.JPG',
  'assets/images/IMG_8262.JPG', 'assets/images/IMG_8263.JPG',
  'assets/images/IMG_8265.JPG', 'assets/images/IMG_8266.JPG',
  'assets/images/IMG_8270.JPG', 'assets/images/IMG_8276.JPG',
  'assets/images/IMG_8277.JPG', 'assets/images/IMG_8278.JPG',
  'assets/images/IMG_8281.JPG'
];
let lbIndex = 0;

document.addEventListener('DOMContentLoaded', function () {
  const gallery = document.getElementById('photo-gallery');
  if (!gallery) return;

  gallery.addEventListener('click', function (e) {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    openLightbox(parseInt(item.dataset.index));
  });

  document.getElementById('lightbox').addEventListener('click', function (e) {
    if (e.target === this) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!document.getElementById('lightbox').classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
  });
});

function openLightbox(i) {
  lbIndex = i;
  const img = document.getElementById('lb-img');
  img.style.opacity = '0';
  img.src = galleryPhotos[i];
  img.onload = function () { img.style.opacity = '1'; };
  document.getElementById('lb-counter').textContent = (i + 1) + ' / ' + galleryPhotos.length;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
function lightboxNav(dir) {
  openLightbox((lbIndex + dir + galleryPhotos.length) % galleryPhotos.length);
}
