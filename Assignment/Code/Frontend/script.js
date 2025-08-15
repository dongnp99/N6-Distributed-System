let username = "user_" + Math.floor(Math.random() * 10000);
document.getElementById("username").innerText = username;

// Phân trang
let kafkaCurrentPage = 1;
let directCurrentPage = 1;
const pageSize = 10;

// Gửi request sử dụng Kafka
function sendRequestKafka() {
  fetch("http://127.0.0.1:8080/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: username + "kafka-ticket", useKafka: true })
  })
    .then(res => res.text())
    .then(() => {
      document.getElementById("sendStatus").innerText = "✅ Gửi thành công!";
      username = "user_" + Math.floor(Math.random() * 10000);
      document.getElementById("username").innerText = username;
    })
    .catch(() => {
      document.getElementById("sendStatus").innerText = "❌ Lỗi gửi yêu cầu!";
    });
}

// Gửi request trực tiếp
function sendRequest() {
  fetch("http://127.0.0.1:8080/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: username + "direct-ticket", useKafka: false })
  })
    .then(res => res.text())
    .then(() => {
      document.getElementById("sendStatus").innerText = "✅ Gửi thành công!";
      username = "user_" + Math.floor(Math.random() * 10000);
      document.getElementById("username").innerText = username;
    })
    .catch(() => {
      document.getElementById("sendStatus").innerText = "❌ Lỗi gửi yêu cầu!";
    });
}

// Cập nhật danh sách đã xử lý (direct)
function updateProcessedDirect() {
  fetch("http://127.0.0.1:8081/process/processed-direct")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("processedListDirect");
      container.innerHTML = "";
      document.getElementById("totalDirect").innerText = data.length;
	  if(data.length > 0 && directCurrentPage == 0) directCurrentPage = 1;
      const totalPages = Math.ceil(data.length / pageSize);
      if (directCurrentPage > totalPages) directCurrentPage = totalPages;

      const start = (directCurrentPage - 1) * pageSize;
      const end = directCurrentPage * pageSize;
      const currentPageData = data.slice(start, end);

      currentPageData.forEach(msg => {
        const div = document.createElement("div");
        div.className = "log-entry";
        div.innerText = JSON.stringify(msg.message);
        container.appendChild(div);
      });

      renderPaginationDirect(totalPages);
    });
}

// Cập nhật danh sách đã xử lý (Kafka)
function updateProcessedKafka() {
  fetch("http://127.0.0.1:8081/process/processed-kafka")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("processedListKafka");
      container.innerHTML = "";
      document.getElementById("totalKafka").innerText = data.length;
	  if(data.length > 0 && kafkaCurrentPage == 0) kafkaCurrentPage = 1;
      const totalPages = Math.ceil(data.length / pageSize);
      if (kafkaCurrentPage > totalPages) kafkaCurrentPage = totalPages;

      const start = (kafkaCurrentPage - 1) * pageSize;
      const end = kafkaCurrentPage * pageSize;
      const currentPageData = data.slice(start, end);

      currentPageData.forEach(msg => {
        const div = document.createElement("div");
        div.className = "log-entry kafka";
        div.innerText = JSON.stringify(msg.message);
        container.appendChild(div);
      });

      renderPaginationKafka(totalPages);
    });
}

// ======= Phân trang đẹp (Direct) =======
function renderPaginationDirect(totalPages) {
  const pagination = document.getElementById("paginationDirect");
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  const createButton = (label, page, isDisabled = false) => {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.className = "pagination-button";
    if (isDisabled) btn.disabled = true;
    if (page === directCurrentPage) btn.classList.add("active");
    btn.onclick = () => {
      directCurrentPage = page;
      updateProcessedDirect();
    };
    return btn;
  };

  pagination.appendChild(createButton("⏮", 1, directCurrentPage === 1));

  const maxButtons = 5;
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, directCurrentPage - half);
  let end = Math.min(totalPages, directCurrentPage + half);

  if (directCurrentPage <= half) end = Math.min(totalPages, maxButtons);
  if (directCurrentPage + half > totalPages) start = Math.max(1, totalPages - maxButtons + 1);

  if (start > 1) {
    pagination.appendChild(createButton("1", 1));
    if (start > 2) pagination.appendChild(createDots());
  }

  for (let i = start; i <= end; i++) {
    pagination.appendChild(createButton(i, i));
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pagination.appendChild(createDots());
    pagination.appendChild(createButton(totalPages, totalPages));
  }

  pagination.appendChild(createButton("⏭", totalPages, directCurrentPage === totalPages));
}

// ======= Phân trang đẹp (Kafka) =======
function renderPaginationKafka(totalPages) {
  const pagination = document.getElementById("paginationKafka");
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  const createButton = (label, page, isDisabled = false) => {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.className = "pagination-button";
    if (isDisabled) btn.disabled = true;
    if (page === kafkaCurrentPage) btn.classList.add("active");
    btn.onclick = () => {
      kafkaCurrentPage = page;
      updateProcessedKafka();
    };
    return btn;
  };

  pagination.appendChild(createButton("⏮", 1, kafkaCurrentPage === 1));

  const maxButtons = 5;
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, kafkaCurrentPage - half);
  let end = Math.min(totalPages, kafkaCurrentPage + half);

  if (kafkaCurrentPage <= half) end = Math.min(totalPages, maxButtons);
  if (kafkaCurrentPage + half > totalPages) start = Math.max(1, totalPages - maxButtons + 1);

  if (start > 1) {
    pagination.appendChild(createButton("1", 1));
    if (start > 2) pagination.appendChild(createDots());
  }

  for (let i = start; i <= end; i++) {
    pagination.appendChild(createButton(i, i));
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pagination.appendChild(createDots());
    pagination.appendChild(createButton(totalPages, totalPages));
  }

  pagination.appendChild(createButton("⏭", totalPages, kafkaCurrentPage === totalPages));
}

// Hiển thị dấu "..."
function createDots() {
  const dots = document.createElement("span");
  dots.className = "pagination-dots";
  dots.innerText = "...";
  return dots;
}

// Xóa toàn bộ log direct
function deleteAllDirect() {
  if (confirm("Bạn có chắc muốn xóa toàn bộ dữ liệu đã xử lý?")) {
    fetch("http://127.0.0.1:8081/process/clear-direct", { method: "DELETE" })
      .then(res => {
        if (res.ok) {
          alert("Đã xóa dữ liệu.");
          document.getElementById("processedListDirect").innerHTML = "";
          document.getElementById("totalDirect").innerText = "0";
        } else {
          alert("Xóa không thành công.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Lỗi khi gọi API.");
      });
  }
}

// Xóa toàn bộ log kafka
function deleteAllKafka() {
  if (confirm("Bạn có chắc muốn xóa toàn bộ dữ liệu đã xử lý?")) {
    fetch("http://127.0.0.1:8081/process/clear-kafka", { method: "DELETE" })
      .then(res => {
        if (res.ok) {
          alert("Đã xóa dữ liệu.");
          document.getElementById("processedListKafka").innerHTML = "";
          document.getElementById("totalKafka").innerText = "0";
        } else {
          alert("Xóa không thành công.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Lỗi khi gọi API.");
      });
  }
}

// Auto cập nhật dữ liệu mỗi 3 giây
setInterval(updateProcessedDirect, 3000);
setInterval(updateProcessedKafka, 3000);
