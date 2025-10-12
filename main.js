const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const errorMessage = document.querySelector('.error');
const faqs = document.querySelectorAll('.faq');


form.addEventListener('submit', function(event) {
  event.preventDefault(); 
  errorMessage.textContent = '';
  if (nameInput.value.trim() === '' || emailInput.value.trim() === '' || messageInput.value.trim() === '') {
    errorMessage.textContent = 'Заполните все поля формы.';
    return; 
  }

  alert(`Спасибо за ваш отзыв!`);
});


faqs.forEach(faq => {
  faq.addEventListener('click', () => {
    const answer = faq.querySelector('.answer');
    if (answer.style.display === 'block') {
      answer.style.display = 'none';
    } else {
      answer.style.display = 'block';
    }
  });
});

const contactToggle = document.getElementById('contact-toggle');
contactToggle.addEventListener('click', () => {
  if (form.style.display === 'none' || form.style.display === '') {
    form.style.display = 'block';
  } 
  else {
    form.style.display = 'none';
  }
});
