document.getElementById("json-prev-expand").addEventListener("click", e => {
    if (!e.button) {
        const j = document.getElementById("json-prev");

        j.style.maxHeight = j.style.maxHeight ? "" : "710px";
        e.target.textContent = j.style.maxHeight ? "Collapse" : "Expand";
    }
});

document.getElementById("info-prev-expand").addEventListener("click", e => {
    if (!e.button) {
        const i = document.getElementById("info-prev");

        i.style.maxHeight = i.style.maxHeight ? "" : "1000px";
        e.target.textContent = i.style.maxHeight ? "Collapse" : "Expand";
    }
});

document.getElementById("ts-prev-expand").addEventListener("click", e => {
    if (!e.button) {
        const i = document.getElementById("ts-prev");

        i.style.maxHeight = i.style.maxHeight ? "" : "5742px";
        e.target.textContent = i.style.maxHeight ? "Hide" : "Show";
    }
});

document.getElementById("json-prev-copy").addEventListener("click", e => {
    if (!e.button) {
        navigator.clipboard.writeText(document.getElementById("json-prev").innerText.replace(/\u00A0/g, " "));

        e.target.style.backgroundColor = "#0F0";
        e.target.textContent = "Copied!";
        e.target.disabled = true;
        e.target.style.animation = "green-fade 0.3s linear";
        e.target.style.pointerEvents = "none";

        setTimeout(() => {
            e.target.style.backgroundColor = "";
            e.target.textContent = "Copy";
            e.target.disabled = false;
            e.target.style.animation = "";
            e.target.style.pointerEvents = "";
        }, 300);
    }
});