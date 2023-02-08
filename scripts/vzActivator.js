
document.querySelector('.content-activator').addEventListener("click", function(e) {
    var style = window.getComputedStyle(document.querySelector('.content-activated'));
    if (style.display === 'none') {
        document.querySelector('.content-activator').classList.toggle('active', true);
        document.querySelector('.content-activated').classList.toggle('active', true);
    } else {
        document.querySelector('.content-activator').classList.toggle('active', false);
        document.querySelector('.content-activated').classList.toggle('active', false);
    }
});