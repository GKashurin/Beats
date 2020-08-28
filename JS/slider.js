const lefBtn = document.querySelector('#left');
const rightBtn = document.querySelector('#right');
const items = document.querySelector('#items');

let currentRight = 0;

rightBtn.addEventListener('click', e => {
    e.preventDefault();
    currentRight += 100;
    items.style.right = '${currentRight}px';
});


leftBtn.addEventListener('click', e => {
    e.preventDefault();
});