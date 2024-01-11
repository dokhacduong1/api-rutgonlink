const clickLink = document.querySelector('.click-link');

if (clickLink) {
  clickLink.addEventListener('click', async function () {
    const waitLink = document.querySelector('.wait-link');
    waitLink.style.display = 'block';

    try {
      const response = await fetch("/api/v1/get-link", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const data = await response.json();

      if (data.code === 200) {
        window.location.href = data.link;
      } else if (data.code === 400) {
        alert(data.message);
        window.location.reload();
      } else if (data.code === 500) {
        alert(data.message)
        window.location.reload();
      }
    } catch (error) {
      window.location.reload();
      // Xử lý lỗi, ví dụ thông báo hoặc không làm gì cả
    } finally {
      waitLink.style.display = 'none';
    }
  });
}
