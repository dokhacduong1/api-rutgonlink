const clickLink = document.querySelector('.click-link');

if (clickLink) {
  clickLink.addEventListener('click', async function () {
    const waitLink = document.querySelector('.wait-link');
    waitLink.style.display = 'block';

    try {

      const namiIP = {};
      if (localStorage.getItem('nami-ip')) {
        namiIP["ipLocal"] = localStorage.getItem('nami-ip');
      }
      if(getCookie('nami-ip')){
        namiIP["ipCookie"] = getCookie('nami-ip');
      }

      const response = await fetch("/api/v1/get-link", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(namiIP)
      })
      const data = await response.json();
      console.log(data);
      if (data.code === 200) {
        localStorage.setItem('nami-ip', data.ip);
        document.cookie = `nami-ip=${data.ip}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
        window.location.href = data.link;
      }else if (data.code === 302) {
        alert(data.message);
        window.location.reload();
      }
       else if (data.code === 401) {
        localStorage.setItem('nami-ip', data.ip);
        document.cookie = `nami-ip=${data.ip}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
        // alert(data.message);
        // window.location.reload();
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

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}