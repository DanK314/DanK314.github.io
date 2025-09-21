const cursor = document.createElement('div');
cursor.classList.add('cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.pageX - cursor.offsetWidth / 2}px`;
  cursor.style.top = `${e.pageY - cursor.offsetHeight / 2}px`;
});
document.querySelector('header').addEventListener('mouseenter', () => {
  cursor.classList.add('cursor-active');
});
document.querySelector('header').addEventListener('mouseleave', () => {
  cursor.classList.remove('cursor-active');
});
const links = document.querySelectorAll('a');
links.forEach(link => {
  link.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor-active');
  });

  link.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-active');
  });
});

// 모든 h2 태그에 이벤트 리스너 추가
const h2Tags = document.querySelectorAll('h2');
h2Tags.forEach(h2 => {
  h2.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor-active');
  });

  h2.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-active');
  });
});