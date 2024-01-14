const clickLink = document.querySelector('.click-link');

if (clickLink) {
  clickLink.addEventListener('click', async function () {
    const waitLink = document.querySelector('.wait-link');
    waitLink.style.display = 'block';

    try {

      const namiIP = {};
      if (localStorage.getItem('fdsfdsjoisfdjklfdskldsf')) {
        namiIP["ipLocal"] = localStorage.getItem('fdsfdsjoisfdjklfdskldsf');
      }
      if (getCookie('fdsfdsjoisfdjklfdskldsf')) {
        namiIP["ipCookie"] = getCookie('fdsfdsjoisfdjklfdskldsf');
      }

      const response = await fetch("/api/v1/get-link", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(namiIP)
      })
      const data = await response.json();

      if (data.code === 200) {
        localStorage.setItem('fdsfdsjoisfdjklfdskldsf', data.ip);
      
        document.cookie = `fdsfdsjoisfdjklfdskldsf=${data.ip}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
        window.location.href = data.link;
      } else if (data.code === 302) {
        alert(data.message);
        window.location.reload();
      }
      else if (data.code === 401) {
        localStorage.setItem('fdsfdsjoisfdjklfdskldsf', data.ip);
        document.cookie = `fdsfdsjoisfdjklfdskldsf=${data.ip}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
        alert(data.message);
        window.location.reload();
      } else if (data.code === 500) {
        alert(data.message)
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      // Xử lý lỗi, ví dụ thông báo hoặc không làm gì cả
    } finally {
      waitLink.style.display = 'none';
    }
  });
}

function myFunction() {
  // Get the text field
  var copyText = document.getElementById("myInput");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
  alert("Bạn đã copy key: " + copyText.value);
}

function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
const card = document.querySelector('.card-body');
if(card){
    const hisolima = card.getAttribute("id");
    localStorage.setItem('fdsfdsjoisfdjklfdskldsf', hisolima);
    document.cookie = `fdsfdsjoisfdjklfdskldsf=${hisolima}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
}