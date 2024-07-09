document.addEventListener('DOMContentLoaded', function() {
    const cta = document.querySelector('.cta');
    cta.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior
        alert('You are being redirected to the discussion board!');
        window.location.href = 'discussion-board.html'; // Redirect after alert
    });
});