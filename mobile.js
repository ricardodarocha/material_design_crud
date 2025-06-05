//Responsive issues Simulate mobile resize in Web
function toggleMobileNavbar() {
    const navbar = document.getElementById('mobile-navbar');
    if (window.innerWidth <= 870) {
        navbar.style.display = 'flex';
    } else {
        navbar.style.display = 'none';
    }
}

toggleMobileNavbar();
window.addEventListener('resize', toggleMobileNavbar);