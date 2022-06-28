(() => {
    document.querySelectorAll("h3").forEach((e, i) => {
        e.id = `h3-${i}`;
        e.innerHTML = `<a href="./#h3-${i}" class="no-style" style="color: inherit; text-decoration: none">${e.innerHTML}</a>`;
    });
})();