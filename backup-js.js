const clickLink = document.querySelector('.click-link');

if (clickLink) {
  clickLink.addEventListener('click', async function () {
    const waitLink = document.querySelector('.wait-link');
    waitLink.style.display = 'block';

    try {

      const namiIP = {};
      if (localStorage.getItem('fdsfdsjoisfdjklfdskldsf')) {
        namiIP["namiv1"] = localStorage.getItem('fdsfdsjoisfdjklfdskldsf');
      }
      if(getCookie('fdsfdsjoisfdjklfdskldsf')){
        namiIP["namiv2"] = getCookie('fdsfdsjoisfdjklfdskldsf');
      }

      const response = await fetch("/rutgonlink/api/v1/get-link", {
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
      }else if (data.code === 302) {
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
      // XÃ¡Â»Â­ lÃÂ½ lÃ¡Â»Âi, vÃÂ­ dÃ¡Â»Â¥ thÃÂ´ng bÃÂ¡o hoÃ¡ÂºÂ·c khÃÂ´ng lÃ m gÃÂ¬ cÃ¡ÂºÂ£
    } finally {
      waitLink.style.display = 'none';
    }
  });
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}