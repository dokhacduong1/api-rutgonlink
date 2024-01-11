function myFunction() {
  // Get the text field
  var copyText = document.getElementById("myInput");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
  alert("Đã copy key: " + copyText.value);
}
const clickLink = document.querySelector('.click-link');

if (clickLink) {
  clickLink.addEventListener('click', async function () {
    const waitLink = document.querySelector('.wait-link');
    waitLink.style.display = 'block';
    const response = await fetch("/api/v1/get-link", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const data = await response.json();
    if(data.code===200){
      window.location.href = data.link;
    }else{
      alert("Lỗi Rồi Liện Hệ Admin")
    }
    waitLink.style.display = 'none';
  })
}