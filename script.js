
/* =========================
   VFX PAGE
========================= */

const featuredVideo = document.querySelector("#featuredVideo");
const featuredPlayer = document.querySelector(".vfx-featured-player");
const vfxItems = document.querySelectorAll(".vfx-item");

if (featuredVideo && featuredPlayer && vfxItems.length > 0) {

    // Adjust the featured player's width to match the video's aspect ratio
    function updateFeaturedPlayerSize() {
        if (!featuredVideo.videoWidth || !featuredVideo.videoHeight) return;

        const videoAspectRatio = featuredVideo.videoWidth / featuredVideo.videoHeight;
        const playerHeight = featuredPlayer.clientHeight;
        const availableWidth = featuredPlayer.parentElement.clientWidth;

        const calculatedWidth = playerHeight * videoAspectRatio;

        featuredPlayer.style.width =
            Math.min(calculatedWidth, availableWidth) + "px";
    }

    featuredVideo.addEventListener("loadedmetadata", updateFeaturedPlayerSize);
    window.addEventListener("resize", updateFeaturedPlayerSize);


    // Get the video path for a project
    function getVideoSource(item) {

        // First, check whether the project has a preview video
        const previewVideo = item.querySelector(".vfx-preview video");
        const source = previewVideo?.querySelector("source");

        if (source && source.getAttribute("src")) {
            return source.getAttribute("src");
        }

        // If there is no preview video, use the data-video attribute
        return item.dataset.video || null;
    }


    // Select a project and load it into the featured player
    function selectProject(item) {

        const videoPath = getVideoSource(item);

        if (!videoPath) {
            console.error("Missing video source:", item);
            return;
        }

        // Reset all other projects
        vfxItems.forEach(otherItem => {

            otherItem.classList.remove("is-playing");

            // Reset the Reel label
            if (otherItem.classList.contains("vfx-reel-item")) {
                const label = otherItem.querySelector(".vfx-overlay span");

                if (label) {
                    label.textContent = "REEL";
                }
            }

            // Stop any playing thumbnail previews
            const previewVideo = otherItem.querySelector(".vfx-preview video");

            if (previewVideo) {
                previewVideo.pause();
                previewVideo.currentTime = 0;
            }
        });

        // Mark the selected project
        item.classList.add("is-playing");

        // Change the Reel label when the reel is selected
        if (item.classList.contains("vfx-reel-item")) {
            const label = item.querySelector(".vfx-overlay span");

            if (label) {
                label.textContent = "Playing";
            }
        }

        // Load the selected video into the main player
        featuredVideo.pause();
        featuredVideo.src = videoPath;
        featuredVideo.load();

        featuredVideo.play().catch(error => {
            console.log("Video playback requires user interaction:", error);
        });
    }


    // Set up hover and click behaviour for every project
    vfxItems.forEach(item => {

        const previewVideo = item.querySelector(".vfx-preview video");

        // Play thumbnail video when hovering
        item.addEventListener("mouseenter", () => {

            if (!previewVideo) return;
            if (item.classList.contains("is-playing")) return;

            previewVideo.currentTime = 0;
            previewVideo.play().catch(() => {});
        });


        // Stop and reset thumbnail video when leaving
        item.addEventListener("mouseleave", () => {

            if (!previewVideo) return;

            previewVideo.pause();
            previewVideo.currentTime = 0;
        });


        // Load project into the featured player when clicked
        item.addEventListener("click", () => {
            selectProject(item);
        });

    });


    // Automatically select the first project (Highlight Reel)
    selectProject(vfxItems[0]);

}
// =========================
// NAVBAR SCROLL ANIMATION
// =========================

const logo = document.querySelector(".logo");
const isIndexPage = document.querySelector("#work") !== null;

if (logo) {

    // Change logo when scrolling
    window.addEventListener("scroll", () => {
        logo.classList.toggle("scrolled", window.scrollY > 50);
    });

    // Index page: scroll to top when clicking the upward arrow
    if (logo.classList.contains("index-logo")) {
        logo.addEventListener("click", (event) => {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
}


// =========================
// INDEX PAGE SCROLL MEMORY
// =========================

// Save the scroll position when leaving the index page
if (isIndexPage) {
    window.addEventListener("pagehide", () => {
        sessionStorage.setItem("indexScrollPosition", window.scrollY);
    });
}

// Restore the scroll position when returning to the index page
window.addEventListener("pageshow", () => {
    if (isIndexPage) {
        const savedPosition = sessionStorage.getItem("indexScrollPosition");

        if (savedPosition !== null) {
            document.documentElement.style.scrollBehavior = "auto";

            window.scrollTo(0, Number(savedPosition));

            requestAnimationFrame(() => {
                document.documentElement.style.scrollBehavior = "";
            });

            sessionStorage.removeItem("indexScrollPosition");
        }
    }
});