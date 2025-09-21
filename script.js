document.querySelectorAll('menu ul li a').forEach((link, index) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    document.querySelectorAll('main').forEach(main => {
      main.classList.remove('active');
    });

    const targetMain = document.getElementById(`M${index + 1}`);
    targetMain.classList.add('active');
  });
});